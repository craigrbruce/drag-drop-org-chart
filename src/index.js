import React from "react";
import { each } from "lodash";
import PropTypes from "prop-types";

/**
 * 
 * You must initialize google charts' org chart before this will work
 * This should be done in a strategic place as a part of your bundling strategy.
 * This repo initializes the charts in the Example containing component. 
 */
class OrgChart extends React.Component {
  // kept out of state as we want to have control over
  // when rendering happens
  diagram = null;
  draggedNode = null;

  constructor(props) {
    super(props);
    this.state = {
      orgChart: this.props.positions,
    };
  }

  componentDidMount() {
    this.props.getOrgChart();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ orgChart: nextProps.positions });
  }

  componentDidUpdate(prevProps, prevState) {
    google.charts.setOnLoadCallback(this.drawDiagram);
  }

  /**
 * In the real world you would factor out utility functions and
 * make use of
 * recompose: https://github.com/acdlite/recompose
 * to piece them together along with lifecycle methods
 * into a stateless component.
 * 
 * This example is however a companion piece to my blog post.. so I don't want to 
 * muddy concepts.
 * 
 */

  getIds = element => {
    if (element) {
      const id = element.querySelector("hidden[data-id]");
      const parentId = element.querySelector("hidden[data-parent-id]");
      if (id && parentId) {
        return {
          id: id.getAttribute("data-id"),
          parentId: parentId.getAttribute("data-parent-id"),
        };
      }
    }
  };

  dragLeave = event => {
    const element = event.target;
    setTimeout(() => {
      // timeout yields nicer UX (less flicker)
      element.classList.remove("do-not-drop");
      element.classList.remove("do-drop");
    }, 250);
  };

  dragStart = event => {
    const element = event.target;
    const currentNode = this.getIds(element);
    if (currentNode) {
      this.draggedNode = currentNode;
    }
  };

  drop = event => {
    // make sure we are dropping on the parent TD
    // so we can get the id/parentID
    let element = event.target;
    if (element.tagName !== "TD") {
      while (element.parentElement) {
        element = element.parentElement;
        if (element.tagName === "TD") {
          break;
        }
      }
    }
    const dropNode = this.getIds(element);
    if (dropNode && this.draggedNode) {
      if (
        // don't drop into itself
        this.draggedNode.id !== dropNode.id &&
        // don't drop into it's own kids
        this.draggedNode.id !== dropNode.parentId
      ) {
        this.props.update(
          parseInt(this.draggedNode.id, 10),
          parseInt(dropNode.id, 10),
        );
      }
    }
  };

  dragEnter = event => {
    event.preventDefault();
    const element = event.target;
    if (element.tagName === "TD") {
      const dropNode = this.getIds(element);
      if (dropNode && this.draggedNode) {
        if (
          // don't drop into itself
          this.draggedNode.id === dropNode.id ||
          // don't drop into it's own kids
          this.draggedNode.id === dropNode.parentId
        ) {
          element.classList.add("do-not-drop");
        } else {
          element.classList.add("do-drop");
        }
      }
    }
  };

  drawDiagram = () => {
    const { orgChart } = this.state;
    const template = p =>
      `
      <hidden data-id='${p.id}' />
      <hidden data-parent-id='${p.parentId}' />
      <h6>
        ${p.title} 
      </h6>
      `;
    const orgChartDiv = document.getElementById("org-chart");
    if (orgChartDiv) {
      this.diagram = new google.visualization.OrgChart(orgChartDiv);

      google.visualization.events.addOneTimeListener(
        this.diagram,
        "ready",
        () => {
          const nodes = window.document.getElementsByClassName(
            "org-chart-node",
          );
          each(nodes, node => {
            node.setAttribute("draggable", "true");
            node.addEventListener("dragstart", this.dragStart);
            node.addEventListener("dragenter", this.dragEnter);
            node.addEventListener("dragover", this.dragEnter);
            node.addEventListener("dragexit", () => (this.draggedNode = null));
            node.addEventListener("dragleave", this.dragLeave);
            node.addEventListener("drop", this.drop);
          });
        },
      );

      const data = new google.visualization.DataTable();

      data.addColumn("string", "Name");
      data.addColumn("string", "Manager");
      data.addColumn("string", "ToolTip");

      // transform our domain model into a google charts 'view model'
      let positions = orgChart.map(p => [
        // using google chart template syntax
        { v: `${p.id}`, f: template(p) },
        // stop the chart displaying a blank box if there is no parent
        !p.parentId || p.parentId === "0" ? null : `${p.parentId}`,
        // display the position title
        p.title,
      ]);

      data.addRows(positions);

      this.diagram.draw(data, {
        size: "large",
        allowHtml: true,
        nodeClass: "org-chart-node",
      });
    }
  };

  render() {
    return <div id="org-chart" className="org-chart" />;
  }
}

OrgChart.PropTypes = {
  positions: PropTypes.array,
  getOrgChart: PropTypes.func,
  update: PropTypes.func,
};

OrgChart.defaultProps = {
  orgChart: [],
};

export default OrgChart;
