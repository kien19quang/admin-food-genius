import { NextSeoProps } from "next-seo";
import SEO from "./SEO";
import Head from 'next/head'
import { seoDefault } from "@/configs/ConfigSeo";
// import LogoGC from '@/assets/images/LogoGC.svg'


const NextHead = (props: NextSeoProps) => {
  return (
    <>
      <Head>
        {/* <link href={LogoGC.src} rel="shortcut icon" /> */}
        <meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale = 1, maximum-scale=1.0, user-scalable=0, minimal-ui"></meta>
        <meta name="version" content="1.2.1" />
      </Head>
      <SEO {...seoDefault} {...props} />
    </>
  )
}

export default NextHead