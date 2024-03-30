import { getTranslateBeforeDropping } from "../src/utils/GetStyles";
import { expect, test, vi } from "vitest";
// TODO: update tests
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
                                box-sizing: border-box; "
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
const listWithGaps = document.createElement("div");
listWithGaps.innerHTML = `<div style="width: 40%; background-color: darkgray; display: inline-block; overflow: hidden; display: flex; flex-direction: column; gap: 5px; row-gap: 5px;">
	                          <div 
                              class="draggable" 
                              draggable-id="1" 
                              style="
                                color: white; 
                                background-color: red; 
                                padding: 20px 0px; 
                                margin: 23px 0px; 
                                cursor: grab;"
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
                                cursor: grab;
                              ">
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
                                cursor: grab;
                              "
                            >
                              3
                            </div>
                            <div 
                              class="draggable" 
                              draggable-id="4" 
                              style="
                                color: white; 
                                background-color: brown; 
                                padding: 26px 0px; 
                                margin: 27px; 
                                cursor: grab;
                              ">
                                4
                              </div>
                            </div>`;
document.body.appendChild(listWithoutGaps);
document.body.appendChild(listWithGaps);

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

const draggableWithGaps = listWithGaps.getElementsByClassName("draggable");
const draggablesWithGapsList = [...draggableWithGaps] as HTMLElement[];
vi.spyOn(draggablesWithGapsList[0], "getBoundingClientRect").mockReturnValue(
  new DOMRect(0, 0, 239.7, 64)
);
vi.spyOn(draggablesWithGapsList[1], "getBoundingClientRect").mockReturnValue(
  new DOMRect(0, 0, 107.71, 64)
);
vi.spyOn(draggablesWithGapsList[2], "getBoundingClientRect").mockReturnValue(
  new DOMRect(0, 0, 113.71, 76)
);
vi.spyOn(draggablesWithGapsList[3], "getBoundingClientRect").mockReturnValue(
  new DOMRect(0, 0, 185.71, 76)
);
test("check calculateRangeWhileDragging replacing an element with another one further ahead", () => {
  const heightTranslate = getTranslateBeforeDropping(
    "vertical",
    draggablesList,
    0,
    3,
    { scrollX: 0, scrollY: 0 },
    {
      scrollLeft: 0,
      scrollTop: 0,
    }
  );
  expect(heightTranslate.height).toBe(308);
});
test("check calculateRangeWhileDragging replacing an element with another one before", () => {
  const heightTranslate = getTranslateBeforeDropping(
    "vertical",
    draggablesList,
    3,
    0,
    { scrollX: 0, scrollY: 0 },
    {
      scrollLeft: 0,
      scrollTop: 0,
    }
  );
  expect(heightTranslate.height).toBe(-282);
});

test("check calculateRangeWhileDragging replacing an element with another one further ahead with a list with gaps", () => {
  const heightTranslate = getTranslateBeforeDropping(
    "vertical",
    draggablesWithGapsList,
    0,
    3,
    { scrollX: 0, scrollY: 0 },
    {
      scrollLeft: 0,
      scrollTop: 0,
    }
  );
  expect(heightTranslate.height).toBe(361);
});

test("check calculateRangeWhileDragging replacing an element with another one further ahead with a list with gaps", () => {
  const heightTranslate = getTranslateBeforeDropping(
    "vertical",
    draggablesWithGapsList,
    1,
    3,
    { scrollX: 0, scrollY: 0 },
    {
      scrollLeft: 0,
      scrollTop: 0,
    }
  );
  expect(heightTranslate.height).toBe(268);
});
