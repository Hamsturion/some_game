import ColoringClick from "Coloring/ColoringClick";
import ColoringMove from "Coloring/ColoringMove";
import "Cube/Cube.css";
import { CubeContext } from "Cube/CubeContext";
import Site from "Cube/Site";
import ActionLogToDB from "DB/ActionLogToDB";
import CheckForSitesTrue from "DB/CheckForSitesTrue";
import FirstAndLastBoxToDB from "DB/FirstAndLastBoxToDB";
import GetItem from "DB/GetItem";
import GetSiteAndAddToDB from "DB/GetSiteAndAddToDB";
import "Logic/Action/Click/Click.css";
import "Logic/Action/Move/Move.css";
import ConvertInRC from "Logic/Converting/ConvertInRC";
import InverseClass from "Logic/Converting/InverseClass";
import StepId from "Logic/Converting/StepId";
import UserStepCounter from "Logic/Action/UserStepCounter";
import StepToNextArray from "Logic/Converting/StepToNextArray";
import { useContext } from "react";
import React from "react";

function Cube(props) {
  const cube = useContext(CubeContext);

  FirstAndLastBoxToDB();

  function ActionInOut(e, todo, siteClass, rowsId, colsId) {
    const targetBoxSite = e.target;
    const targetBoxSiteClass = siteClass;

    const nextArray = ConvertInRC(
      StepToNextArray(rowsId, colsId, targetBoxSiteClass)
    );

    const nextBox = document.querySelector("." + nextArray);

    if (nextBox != null && !targetBoxSite.className.includes("color_click")) {
      const nextBoxSite = nextBox.querySelector(
        "." + InverseClass(targetBoxSiteClass)
      );
      ColoringMove(targetBoxSite, todo, UserStepCounter("moveUser"));
      ColoringMove(nextBoxSite, todo, UserStepCounter("moveUser"));
    }
  }

  function ActionClick(e, siteClass, idcount, rowsId, colsId) {
    const targetBoxSite = e.target;

    const targetBoxSiteClass = siteClass;
    const nextTargetBoxSiteClass = InverseClass(targetBoxSiteClass);
    const nextArray = ConvertInRC(
      StepToNextArray(rowsId, colsId, targetBoxSiteClass)
    );
    const nextBox = document.querySelector("." + nextArray);

    if (nextBox != null && !targetBoxSite.className.includes("color_click")) {
      const nextBoxSite = nextBox.querySelector("." + nextTargetBoxSiteClass);

      ColoringClick(targetBoxSite);
      ColoringClick(nextBoxSite);

      const boxid1 = idcount;
      const boxid2 = StepId(rowsId, colsId, targetBoxSiteClass);

      const asyncClick = async (
        boxid1,
        boxid2,
        targetBoxSiteClass,
        nextTargetBoxSiteClass
      ) => {
        const resp1 = await GetItem(boxid1, "boxes");
        const resp2 = await GetItem(boxid2, "boxes");
        const respdata1 = await resp1;
        const respdata2 = await resp2;

        GetSiteAndAddToDB(
          respdata1,
          respdata2,
          targetBoxSiteClass,
          nextTargetBoxSiteClass
        );

        CheckForSitesTrue(respdata1, respdata2);
        ActionLogToDB(
          respdata1,
          respdata2,
          targetBoxSiteClass,
          nextTargetBoxSiteClass
        );
      };

      asyncClick(boxid1, boxid2, targetBoxSiteClass, nextTargetBoxSiteClass);
    }
  }

  const shorterClick = (e, siteClass) => {
    ActionClick(e, siteClass, cube[0].idcount, cube[0].rowsId, cube[0].colsId);
  };

  const shorterInOut = (e, todo, siteClass) => {
    ActionInOut(e, todo, siteClass, cube[0].rowsId, cube[0].colsId);
  };

  return (
    <>
      <div
        key={props.key}
        className={"box occupied " + [cube[0].half] + " " + [cube[0].startEnd]}
      >
        <div
          id={cube[0].idcount}
          className={
            "cubebox" + " " + "rc-" + cube[0].rowsId + "_" + cube[0].colsId
          }
        >
          <div className="corner_t_l"></div>
          <Site
            siteClass="line_top"
            onSiteClick={(e) => shorterClick(e, "line_top")}
            onSiteMoveIn={(e) => shorterInOut(e, "add", "line_top")}
            onSiteMoveOut={(e) => shorterInOut(e, "remove", "line_top")}
          />
          <div className="corner_t_r"></div>
          <Site
            siteClass="line_left"
            onSiteClick={(e) => shorterClick(e, "line_left")}
            onSiteMoveIn={(e) => shorterInOut(e, "add", "line_left")}
            onSiteMoveOut={(e) => shorterInOut(e, "remove", "line_left")}
          />
          <div className="piskvorka"></div>
          <Site
            siteClass="line_right"
            onSiteClick={(e) => shorterClick(e, "line_right")}
            onSiteMoveIn={(e) => shorterInOut(e, "add", "line_right")}
            onSiteMoveOut={(e) => shorterInOut(e, "remove", "line_right")}
          />
          <div className="corner_b_l"></div>
          <Site
            siteClass="line_bottom"
            onSiteClick={(e) => shorterClick(e, "line_bottom")}
            onSiteMoveIn={(e) => shorterInOut(e, "add", "line_bottom")}
            onSiteMoveOut={(e) => shorterInOut(e, "remove", "line_bottom")}
          />
          <div className="corner_b_r"></div>
        </div>
      </div>
    </>
  );
}

export default Cube;
