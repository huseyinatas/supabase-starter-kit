import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";

import type { Database } from "@/lib/database.types";
import kkHash from "@/utils/kkHash";
// @ts-ignore
import xml2js from "xml2js";
import axios from "axios";
type Inputs = {
  cardOwner: string;
  cardNumber: string;
  cardMonth: string;
  cardYear: string;
  cardCvv: string;
  offerId: string;
};

export async function POST(
  request: Request,
  { params }: { params: { id: string } },
) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });
  const {
    data: { session },
  } = (await supabase.auth.getSession()) as any;

  if (!session)
    return NextResponse.json({ error: "No session" }, { status: 401 });

  const { data: offer, error } = await supabase
    .from("offers")
    .select("*")
    .eq("id", params.id)
    .single();

  if (error) return NextResponse.json({ error }, { status: 400 });

  if (!offer)
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });

  const parser = new xml2js.Parser();
  const username = "sigortamweb";
  const password = "JhH0R90FISVinyQHThkXzmp_e";
  const base64Auth = Buffer.from(`${username}:${password}`).toString("base64");

  const url =
    "https://api.aksigorta.com.tr/api/policePDFSorgulamaWS-V2.0/PolicePDFSorgulamaWebService";
  const soapEnvelope = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:pol="http://policePDFSorgulama.police.webServices.aksigorta.tr.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <pol:policePDFSorgulama>
         <policePDFSorgulama>
            <kanalBilgileri>
               <kanalId>496</kanalId>
               <branchId>2724</branchId>
               <token>NcmwMLwBA3xlrCCr</token>
            </kanalBilgileri>
            <policeNo>${offer?.policeNo}</policeNo>
            <basimDili>H</basimDili>
            <zeylSiraNo>0</zeylSiraNo>
         </policePDFSorgulama>
      </pol:policePDFSorgulama>
   </soapenv:Body>
</soapenv:Envelope>
  `;

  const config = {
    headers: {
      "Content-Type": "text/xml; charset=utf-8",
      SOAPAction: "",
      Authorization: `Basic ${base64Auth}`,
    },
  };

  let res: any;

  await axios
    .post(url, soapEnvelope, config)
    .then(async (response) => {
      await parser.parseString(response.data, (err: any, result: any) => {
        if (err) {
          console.log("Error:", err);
          return NextResponse.json({ error: err, status: 400 });
        }
        res = result;
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  return NextResponse.json(
    {
      data: res["S:Envelope"]["S:Body"][0]["ns2:policePDFSorgulamaResponse"][0][
        "return"
      ][0],
    },
    { status: 200 },
  );
}
