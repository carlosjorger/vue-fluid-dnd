import { calculateRangeWhileDragging } from "../src/utils/GetStyles";
import { expect, test, vi } from "vitest";

test("check calculateRangeWhileDragging", () => {
  const list = document.createElement("div");
  list.innerHTML = `<div style="background-color: darkgray; display: block;">
                        <div 
                            class="draggable" 
                            draggable-id="1" 
                            style="
                                color: white; 
                                background-color: red; 
                                padding: 20px 0px; 
                                margin: 23px 0px; 
                                height: 63.9986px; 
                                width: 413.956px; 
                                box-sizing: border-box; 
                                top: 157px; left: 129px;"
                            >
                                1
                            </div>
                            <div 
                                class="draggable" 
                                draggable-id="2" 
                                style="
                                    color: white; 
                                    background-color: blue; 
                                    padding: 20px 0px; 
                                    margin: 12px 120px 12px 12px;
                                    transform: translate(0px, 0px);"
                            >
                                2
                            </div>
                            <div 
                                class="draggable" 
                                draggable-id="3" 
                                style="
                                    color: white; 
                                    background-color: green; 
                                    padding: 26px 0px; 
                                    margin: 26px 26px 26px 100px; 
                                    transform: translate(0px, 0px);"
                            >
                                3
                            </div>
                            <div 
                                class="draggable" 
                                draggable-id="4" 
                                style="
                                    color: white; 
                                    background-color: wheat; 
                                    padding: 40px 0px; 
                                    margin: 20px 100px 20px 0px; 
                                    width: 30%; 
                                    transform: translate(0px, 0px);"
                            >
                                4
                            </div>
                            <div 
                                class="draggable" 
                                draggable-id="5" 
                                style="
                                    color: white; 
                                    background-color: crimson; 
                                    padding: 26px 0px; 
                                    margin: 20px 100px 20px 0px; 
                                    transform: translate(0px, 0px);
                                    "
                            >
                                5
                                </div>
                            </div>`;
  document.body.appendChild(list);
  const draggables = list.getElementsByClassName("draggable");
  const draggablesList = [] as HTMLElement[];
  for (const draggable of draggables) {
    draggablesList.push(draggable as HTMLElement);
  }

  calculateRangeWhileDragging(
    "marginTop",
    "marginBottom",
    "height",
    "rowGap",
    draggablesList,
    0,
    3
  );
});
