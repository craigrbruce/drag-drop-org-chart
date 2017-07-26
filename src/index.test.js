import React from "react";
import ReactDOM from "react-dom";
import OrgChart from "index";

describe("<index />", () => {
  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(<OrgChart />, div);
  });
});

describe("<OrgChart />", () => {
    /**
     * 
     * Of course we need tests!!! ;)
     * 
     * I will leave it as an exercise to you, dear reader ;) :D
     */
});
