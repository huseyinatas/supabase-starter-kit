import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/utils/supabase";
import { redirect } from "next/navigation";
export async function POST(
  request: Request,
  { params }: { params: { slug: string } },
) {
  const { data: offer, error } = await supabaseAdmin
    .from("offers")
    .select("*")
    .eq("id", params.slug)
    .single();

  if (error) return NextResponse.json({ error }, { status: 400 });

  if (!offer)
    return NextResponse.json({ error: "Offer not found" }, { status: 404 });
  const formData = await request.formData();
  const errorType = formData.get("errorType");
  if (errorType === "SUCCESS") {
    const daskPoliceNo = formData.get("daskPoliceNo");
    const policeNo = formData.get("policeNo");
    const updateData = {
      status: "approved",
      daskPoliceNo,
      policeNo,
    };

    const { error: updateEror } = await supabaseAdmin
      .from("offers")
      .update(updateData)
      .eq("id", params.slug);

    if (updateEror) return NextResponse.json({ error }, { status: 400 });

    return redirect("https://panel.daskla.com/offers/success/" + params.slug);
  }
  return redirect("https://panel.daskla.com/offers/fail/" + params.slug);
}
