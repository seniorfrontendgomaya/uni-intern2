import { FooterClient } from "@/components/ui/landing-footer";
import { getFooterData } from "@/services/footer.service";

/** Server-rendered footer: fetches the three APIs and renders FooterClient. Use on Home, Privacy, Contact. */
export async function FooterSSR() {
  const { locations, skills } = await getFooterData();
  return (
    <FooterClient
      locations={locations}
      skills={skills}
    />
  );
}
