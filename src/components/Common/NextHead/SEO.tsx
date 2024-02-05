import { NextSeo, NextSeoProps } from "next-seo"

const SEO = (props: NextSeoProps) => {
  const { noindex, description, canonical, title, openGraph } = props

  return (
    <NextSeo 
      noindex={noindex}
      title="Food Genius"
      description={description ? description : "Food Genius - Chọn món bạn muốn, giao liên tay bạn"}
      canonical={canonical}
      openGraph={{
        type: 'website',
        url: openGraph?.url,
        title: title || "Food Genius",
        description: description ? description : "Food Genius - Chọn món bạn muốn, giao liên tay bạn",
        siteName: "Food Genius"
      }}
      additionalMetaTags={[
        
      ]}
    />
  )
}

export default SEO