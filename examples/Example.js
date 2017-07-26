import React from "react";
import { findIndex } from "lodash";
import OrgChart from "../src/index";

google.charts.load("current", {
  packages: ["orgchart"],
});

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      positions,
    };
  }

  componentDidMount() {}

  getOrgChart = () => {
    // api call goes here .. or redux action
    this.setState({ positions });
  };

  update = (id, parentId) => {
    // ya, use Immutable.js if you want - this is a quick and dirty hackeroo. Enjoy! ;)
    const positions = this.state.positions.slice(); //clone wars
    const index = findIndex(positions, { id });
    const position = positions[index];
    positions.splice(index, 1, {
      id: position.id,
      title: position.title,
      parentId,
    });
    this.setState({ positions });
  };

  render() {
    return (
      <div>
        <OrgChart
          positions={this.state.positions}
          getOrgChart={this.getOrgChart}
          update={this.update}
        />
      </div>
    );
  }
}

const positions = [ // oh noez! all these positions need re-arranging .. drag and drop to the rescue. Enjoy!
  { title: "CTO", parentId: 0, id: 491 },
  { title: "Architect", parentId: 498, id: 493 },
  { title: "QA Tester", parentId: 498, id: 492 },
  { title: "Brand Manager", parentId: 496, id: 494 },
  {
    title: "Business Analyst",
    id: 495,
    parentId: 494,
  },
  {
    title: "Account Manager",
    parentId: 494,
    id: 496,
  },
  { title: "Product Manager", parentId: 491, id: 497 },
  { title: "Software Developer - Mid Level", parentId: 499, id: 498 },
  { title: "Software Developer - Senior", parentId: 493, id: 499 },
];
export default Example;
