import { getLocale } from "@/lib/locale"
import { getDictionary } from "@/lib/i18n"
import RsvpForm from "@/components/RsvpForm"
import LocaleSwitcher from "@/components/LocaleSwitcher"

export default async function RsvpPage() {
  const locale = await getLocale()
  const dict = getDictionary(locale)

  return (
    <div className="relative">
      <div className="absolute right-4 top-4 z-10 sm:right-6 sm:top-6">
        <LocaleSwitcher current={locale} />
      </div>
      <RsvpForm dict={dict} locale={locale} />
    </div>
  )
}
