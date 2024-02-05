import { ConfigProvider } from "antd";
import { Roboto, Roboto_Mono } from "next/font/google";

const roboto = Roboto({
  subsets: ["vietnamese", "cyrillic", "latin-ext"],
  display: "auto",
  weight: ['100', '300', '400', '500', '700']
});

export default function Theme(children: JSX.Element) {
  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#6f57eb",
          colorText: "#101828",
          fontSizeHeading1: 24,
          fontSizeHeading2: 20,
          borderRadius: 8,
          fontSize: 16,
        },
        components: {
          Menu: {
            borderRadius: 8,
            itemMarginInline: 16,
          },
          Input: {
            controlHeight: 36,
            activeShadow: "none",
          },
          Button: {
            controlHeight: 36,
            colorLink: "#6f57eb",
            colorLinkHover: "#6f57ebcc",
          },
          Tooltip: {
            colorBgSpotlight: "#545454eb",
          },
          Dropdown: {
            controlHeight: 36,
          },
          Card: {
            padding: 20,
            paddingLG: 20,
          },
          Upload: {
            paddingXS: 0,
            borderRadiusLG: 8,
          },
          Select: {
            controlHeight: 36,
          },
          DatePicker: {
            controlHeight: 36,
          },
          Table: {
            fontWeightStrong: 500,
            headerColor: "#667085",
          },
        },
      }}
    >
      {children}
    </ConfigProvider>
  );
}
