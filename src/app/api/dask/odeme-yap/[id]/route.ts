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

  const { data: offer, error } = (await supabase
    .from("offers")
    .select("*")
    .eq("id", params.id)
    .single()) as any;

  if (error) return NextResponse.json({ error }, { status: 400 });

  if (!offer)
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });

  const { cardOwner, cardNumber, cardMonth, cardYear, cardCvv } =
    (await request.json()) as Inputs;
  // @ts-ignore
  const dateObject = new Date(offer?.definitions?.dogumTarihi);

  const day = dateObject.getDate();
  const month = dateObject.getMonth() + 1;
  const year = dateObject.getFullYear();
  const formattedDate = `${day}/${month}/${year}`;
  const hashedCardNumber = await kkHash(
    cardNumber.replace(/\s/g, ""),
    "zVFU9lJOMGxgbBfz",
  );
  const parser = new xml2js.Parser();
  const username = "sigortamweb";
  const password = "JhH0R90FISVinyQHThkXzmp_e";
  const base64Auth = Buffer.from(`${username}:${password}`).toString("base64");

  const url = "https://api.aksigorta.com.tr/api/daskWS-V2.0/DaskWebService";
  const return_url = "https://devneolife.com/callback";
  const soapEnvelope = `
<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:dask="http://dask.genel.webServices.aksigorta.tr.com/">
   <soapenv:Header/>
   <soapenv:Body>
      <dask:daskPoliceOlustur3dUrlOlustur>
         <daskPoliceOlustur3dUrlOlusturmaInput>
            <kanalBilgileri>
               <kanalId>496</kanalId>
               <branchId>2724</branchId>
               <token>NcmwMLwBA3xlrCCr</token>
            </kanalBilgileri>
             <teklifNo>${offer?.policy_number}</teklifNo> 
            <returnUrl>${return_url}/${offer?.id}</returnUrl>
            <sigortaEttiren>
               <sigortaliSigortaEttirenFarkliMi>H</sigortaliSigortaEttirenFarkliMi>
               <kimlikNo>${offer?.definitions?.tc}</kimlikNo>
               <dogumTarihi>${formattedDate}</dogumTarihi>
               <cepNo>${offer?.definitions?.phone}</cepNo>
               <meslekKodu>2052</meslekKodu>
               <adresIlKodu>0${offer?.definitions?.uavt?.il}</adresIlKodu>
               <adresBeldeKodu>${offer?.definitions?.uavt?.ilce}</adresBeldeKodu>
            </sigortaEttiren>
            <sorular>
               <yapiTarzi>${offer?.definitions?.yapiTarzi}</yapiTarzi>
               <yuzOlcumu>${offer?.definitions?.yuzOlcumu}</yuzOlcumu>
               <binaInsaYili>${offer?.definitions?.binaInsaYili}</binaInsaYili>
               <binaKatSayisi>${offer?.definitions?.binaKatSayisi}</binaKatSayisi>
               <rizikoUavtAdresNo>${offer?.definitions?.uavt?.daire?.uavtAdresNo}</rizikoUavtAdresNo>
               <daireKullanimSekli>0${offer?.definitions?.daireKullanimSekli}</daireKullanimSekli>
               <sigortaliKati>${offer?.definitions?.sigortaliKati}</sigortaliKati>
               <sigortaEttirenSifati>01</sigortaEttirenSifati>
            </sorular>
            <tahsilatBilgileri>
                <pesinVadeli>P</pesinVadeli>
               <kartHesapSahibiAdSoyad>${cardOwner}</kartHesapSahibiAdSoyad>
               <krediKartNo>${hashedCardNumber}</krediKartNo>
               <cvvNo>${cardCvv}</cvvNo>
               <sonKullanmaTarihi>${cardMonth}/${cardYear}</sonKullanmaTarihi>
               <taksitSayisi>1</taksitSayisi>
            </tahsilatBilgileri>
         </daskPoliceOlustur3dUrlOlusturmaInput>
      </dask:daskPoliceOlustur3dUrlOlustur>
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
          result["S:Envelope"]["S:Body"][0][
            "ns2:daskPoliceOlustur3dUrlOlusturResponse"
          ][0]["return"][0]?.errorCode[0] === "08"
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
          result["S:Envelope"]["S:Body"][0][
            "ns2:daskPoliceOlustur3dUrlOlusturResponse"
          ][0]["return"][0];
      });
    })
    .catch((error) => {
      console.error("Error:", error);
    });
  const order_token = res?.orderToken[0];
  console.log(order_token);
  return NextResponse.json({ data: res }, { status: 200 });
}
