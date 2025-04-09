import React, { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  PageModel,
  CARD_DATA,
  CARD_WITH_LINE_DATA,
  BAR_DATA,
  DATA_DISPLAY_TYPE,
  FORM_DATA,
  BUTTON_MODEL,
} from "../../Models/PageModel";
import FormRenderer from "./Fromcontrols/components/FormRenderer";
import Bar from "./Bar";
import Card from "./Card";
import CardWithLine from "./CardWithLine";
import Pie, { PIE_DATA } from "./Pie";
import { TABLE_DATA } from "./Table/Model";
import Table from "../Components/Table/Table";
import handleEvents from "../Utilities/EventHandle";
import { Toast } from "primereact/toast";

export interface ComponentRendererRef {
  submitForm: () => Promise<boolean>;
  clearForm: () => void;
}

export interface ComponentRefsMap {
  [key: string]: ComponentRendererRef | null;
}

function PageRenderer(config: PageModel) {
  const compRefs = useRef<ComponentRefsMap>({}); // name -> componentRenderRef
  const navigate = useNavigate();
  const toast = useRef<Toast>(null);

  const handleButtonClick = async (item: BUTTON_MODEL) => {
    handleEvents(item, navigate, compRefs, toast);
  };

  return (
    <div id="main_page">
      <Toast ref={toast} position="top-right" />
      <div className="d-flex align-middle justify-content-between">
        <div className="main_head">{config?.title}</div>
        <div className="btn_group">
          {config?.buttons?.map((item, index) => (
            <button
              key={index}
              className={"btn " + item.theme}
              onClick={() => handleButtonClick(item)}
            >
              {item.text || <i className={"bi " + item.icon}></i>}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-4 row row-gap-4">
        {config?.columns?.map((item, index) => (
          <div
            key={index}
            className={
              "col-xl-" +
              item.size.xl +
              " col-lg-" +
              item.size.lg +
              " col-md-" +
              item.size.md +
              " col-sm-" +
              item.size.sm
            }
          >
            {item.type === DATA_DISPLAY_TYPE.CARD_WITH_LINE && (
              <CardWithLine {...(item.content as CARD_WITH_LINE_DATA)} />
            )}
            {item.type === DATA_DISPLAY_TYPE.CARD && (
              <Card {...(item.content as CARD_DATA)} />
            )}
            {item.type === DATA_DISPLAY_TYPE.TABLE && (
              <Table {...(item.content as TABLE_DATA)} />
            )}
            {item.type === DATA_DISPLAY_TYPE.PIE && (
              <Pie {...(item.content as PIE_DATA)} />
            )}
            {item.type === DATA_DISPLAY_TYPE.BAR && (
              <Bar {...(item.content as BAR_DATA)} />
            )}
            {item.type === DATA_DISPLAY_TYPE.FORM && (
              <FormRenderer
                ref={(el) => {
                  if (item.name) {
                    compRefs.current[item.name] = el;
                  }
                }}
                {...(item.content as FORM_DATA)}
              />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default PageRenderer;
