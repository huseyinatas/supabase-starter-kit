import { NextResponse } from "next/server";

import axios from "axios";

// @ts-ignore
import xml2js from "xml2js";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const binaKodu = searchParams.get("binaKodu");
  const parser = new xml2js.Parser();
  const username = "sigortamweb";
  const password = "JhH0R90FISVinyQHThkXzmp_e";
  const base64Auth = Buffer.from(`${username}:${password}`).toString("base64");

  const url =
    "https://api.aksigorta.com.tr/api/daskUavtWS-V2.0/daskUavtWebservice";

  const soapEnvelope = `<?xml version="1.0" encoding="utf-8"?>
    <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:das="http://daskuavt.genel.webServices.aksigorta.tr.com/">
       <soapenv:Header/>
       <soapenv:Body>
       <das:daskUavtDaireSorgula>
         <!--Optional:-->
         <daskUavtDaireSorgulamaInput>
            <kanalBilgileri>
               <kanalId>496</kanalId>
               <branchId>2724</branchId>
               <token>NcmwMLwBA3xlrCCr</token>
            </kanalBilgileri>
            <binaKodu>${binaKodu}</binaKodu>
         </daskUavtDaireSorgulamaInput>
      </das:daskUavtDaireSorgula>
       </soapenv:Body>
    </soapenv:Envelope>`;

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
          console.error("Error:", err);
        }

        res =
          result["S:Envelope"]["S:Body"][0][
            "ns2:daskUavtDaireSorgulaResponse"
          ][0]["return"][0];
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  return NextResponse.json({ data: res, status: 200 });
}
