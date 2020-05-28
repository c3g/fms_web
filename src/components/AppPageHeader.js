import React from "react";

import {Affix, PageHeader} from "antd";
import "antd/es/affix/style/css";
import "antd/es/page-header/style/css";

const style = {
  backgroundColor: "rgba(0, 0, 0, 0.03)",
  borderBottom: "1px solid #ccc",
  flex: "0",
};

const AppPageHeader = ({...props}) =>
  <PageHeader
    ghost={false}
    style={style}
    {...props}
  />;

export default AppPageHeader;
