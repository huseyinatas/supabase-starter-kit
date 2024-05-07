import { NextResponse } from "next/server";

import axios from "axios";

// @ts-ignore
import xml2js from "xml2js";
import { cookies } from "next/headers";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import type { Database } from "@/lib/database.types";

export async function POST(request: Request) {
  const cookieStore = cookies();
  const supabase = createRouteHandlerClient<Database>({
    cookies: () => cookieStore,
  });

  const {
    data: { session },
  } = (await supabase.auth.getSession()) as any;

  if (!session)
    return NextResponse.json({ error: "No session" }, { status: 401 });

  const {
    tc,
    dogumTarihi,
    phone,
    uavt,
    yapiTarzi,
    yuzOlcumu,
    binaInsaYili,
    binaKatSayisi,
    daireKullanimSekli,
    sigortaliKati,
    sigortaEttirenSifati,
  } = await request.json();
  const dateObject = new Date(dogumTarihi);

  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  const parser = new xml2js.Parser();
  const username = "sigortamweb";
  const password = "JhH0R90FISVinyQHThkXzmp_e";
  const base64Auth = Buffer.from(`${username}:${password}`).toString("base64");

  const url = "https://api.aksigorta.com.tr/api/daskWS-V2.0/DaskWebService";

  const soapEnvelope = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:dask="http://dask.genel.webServices.aksigorta.tr.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <dask:daskTeklifOlustur>
         <!--Optional:-->
         <daskTeklifOlusturmaInput>
            <kanalBilgileri>
               <kanalId>496</kanalId>
               <branchId>2724</branchId>
               <token>NcmwMLwBA3xlrCCr</token>
            </kanalBilgileri>
            <sigortaEttiren>
               <sigortaliSigortaEttirenFarkliMi>H</sigortaliSigortaEttirenFarkliMi>
               <kimlikNo>${tc}</kimlikNo>
               <dogumTarihi>${formattedDate}</dogumTarihi>
               <cepNo>${phone}</cepNo>
               <meslekKodu>2052</meslekKodu>
               <adresIlKodu>${uavt?.il}</adresIlKodu>
               <adresBeldeKodu>${uavt?.ilce}</adresBeldeKodu>
            </sigortaEttiren>
            <sorular>
               <yapiTarzi>${yapiTarzi}</yapiTarzi>
               <yuzOlcumu>${yuzOlcumu}</yuzOlcumu>
               <binaInsaYili>${binaInsaYili}</binaInsaYili>
               <binaKatSayisi>${binaKatSayisi}</binaKatSayisi>
               <rizikoUavtAdresNo>${uavt?.daire?.uavtAdresNo}</rizikoUavtAdresNo>
               <daireKullanimSekli>0${daireKullanimSekli}</daireKullanimSekli>
               <sigortaliKati>${sigortaliKati}</sigortaliKati>
               <sigortaEttirenSifati>01</sigortaEttirenSifati>
            </sorular>
         </daskTeklifOlusturmaInput>
      </dask:daskTeklifOlustur>
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
        if (
          result["S:Envelope"]["S:Body"][0]["ns2:daskTeklifOlusturResponse"][0][
            "return"
          ][0]?.errorCode[0] === "08"
        ) {
          console.log(
            "Error:",
            result["S:Envelope"]["S:Body"][0][
              "ns2:daskTeklifOlusturResponse"
            ][0]["return"][0]?.errorMessage[0],
          );
          return NextResponse.json({
            error:
              result["S:Envelope"]["S:Body"][0][
                "ns2:daskTeklifOlusturResponse"
              ][0]["return"][0]?.errorMessage[0],
            status: 400,
          });
        }
        res =
          result["S:Envelope"]["S:Body"][0]["ns2:daskTeklifOlusturResponse"][0][
            "return"
          ][0];
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });

  const insertData: any = {
    status: "pending",
    policy_number: res?.policeNo[0],
    name_surname: res?.adSoyad[0],
    address: res?.adres[0],
    start_date: res?.policeBaslamaTarihi[0],
    end_date: res?.policeBitisTarihi[0],
    guarantee: res?.teminatBilgileri[0].teminatBilgisi[0].bedel[0],
    paid_amount: res?.teminatBilgileri[0].teminatBilgisi[0].netPrim[0],
    definitions: {
      tc,
      dogumTarihi,
      phone,
      uavt,
      yapiTarzi,
      yuzOlcumu,
      binaInsaYili,
      binaKatSayisi,
      daireKullanimSekli,
      sigortaliKati,
      sigortaEttirenSifati,
    },
    team: null,
  };
  const { data: profile, error: profileError } = (await supabase
    .from("profiles")
    .select("*, role(*)")
    .eq("id", session.user.id)
    .single()) as any;
  if (
    profile?.role.name === "team-admin" ||
    profile?.role.name === "user" ||
    profile?.role.name === "user-viewing"
  ) {
    insertData.team = profile.team;
  }
  const { data, error } = await supabase
    .from("offers")
    .insert(insertData)
    .select("*");

  if (error) return NextResponse.json({ error }, { status: 400 });

  res.offer = data;

  return NextResponse.json({ data: res, status: 200 });
}
