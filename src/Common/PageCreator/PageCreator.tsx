import { useEffect, useState } from "react";
import PageRenderer from "../Components/PageRenderer";
import { getConfig } from "../../API/config";
import { PageModel } from "../../Models/PageModel";
import { RouteConfigModel } from "../../App/AppRoutes";

function PageCreator(props: RouteConfigModel) {
  const [config, setConfig] = useState<PageModel | null>(null);

  useEffect(() => {
    if (props.configPath) {
      getConfig(props.configPath).then((res: PageModel) => {
        setConfig(res);
      });
    }
  }, [props.configPath]);

  if (!config) {
    return null;
  }

  return <PageRenderer {...config} />;
}

export default PageCreator;
