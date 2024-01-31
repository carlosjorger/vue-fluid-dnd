import { calculateRangeWhileDragging } from "../src/utils/GetStyles";
import { expect, test, vi } from "vitest";
const listWithoutGaps = document.createElement("div");
listWithoutGaps.innerHTML = `<div style="background-color: darkgray; display: block;">
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
document.body.appendChild(listWithoutGaps);
const draggables = listWithoutGaps.getElementsByClassName("draggable");
const draggablesList = [] as HTMLElement[];
for (const draggable of draggables) {
  draggablesList.push(draggable as HTMLElement);
}
vi.spyOn(draggablesList[0], "getBoundingClientRect").mockReturnValue(
  new DOMRect(0, 0, 239.7, 64)
);
vi.spyOn(draggablesList[1], "getBoundingClientRect").mockReturnValue(
  new DOMRect(0, 0, 107.71, 64)
);
vi.spyOn(draggablesList[2], "getBoundingClientRect").mockReturnValue(
  new DOMRect(0, 0, 113.71, 76)
);
vi.spyOn(draggablesList[3], "getBoundingClientRect").mockReturnValue(
  new DOMRect(0, 0, 71.9, 104)
);
vi.spyOn(draggablesList[4], "getBoundingClientRect").mockReturnValue(
  new DOMRect(0, 0, 140, 76)
);

test("check calculateRangeWhileDragging replacing an element with another one further ahead", () => {
  const heightTranslate = calculateRangeWhileDragging(
    "marginTop",
    "marginBottom",
    "height",
    "rowGap",
    draggablesList,
    0,
    3
  );
  expect(heightTranslate).toBe(308);
});
test("check calculateRangeWhileDragging replacing an element with another one before", () => {
  const heightTranslate = calculateRangeWhileDragging(
    "marginTop",
    "marginBottom",
    "height",
    "rowGap",
    draggablesList,
    3,
    0
  );
});
// test("check calculateRangeWhileDragging replacing an element with the next one", () => {
//   const heightTranslate = calculateRangeWhileDragging(
//     "marginTop",
//     "marginBottom",
//     "height",
//     "rowGap",
//     draggablesList,
//     1,
//     2
//   );
//   console.log(heightTranslate);
// });
