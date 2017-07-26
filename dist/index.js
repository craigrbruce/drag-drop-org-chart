(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["drag-drop-org-chart"] = factory();
	else
		root["drag-drop-org-chart"] = factory();
})(this, function() {
return webpackJsonpdrag_drop_org_chart([1],{

/***/ 21:
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react__ = __webpack_require__(8);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_react___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_react__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_prop_types__ = __webpack_require__(20);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1_react_prop_types___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_1_react_prop_types__);
var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }




/**
 * 
 * You must initialize google charts' org chart before this will work
 * This should be done in a strategic place as a part of your bundling strategy.
 * This repo initializes the charts in the Example containing component. 
 */

var OrgChart = function (_React$Component) {
  _inherits(OrgChart, _React$Component);

  // kept out of state as we want to have control over
  // when rendering happens
  function OrgChart(props) {
    _classCallCheck(this, OrgChart);

    var _this = _possibleConstructorReturn(this, (OrgChart.__proto__ || Object.getPrototypeOf(OrgChart)).call(this, props));

    _this.diagram = null;
    _this.draggedNode = null;

    _this.getIds = function (element) {
      if (element) {
        var id = element.querySelector("hidden[data-id]");
        var parentId = element.querySelector("hidden[data-parent-id]");
        if (id && parentId) {
          return {
            id: id.getAttribute("data-id"),
            parentId: parentId.getAttribute("data-parent-id")
          };
        }
      }
    };

    _this.dragLeave = function (event) {
      var element = event.target;
      setTimeout(function () {
        // timeout yields nicer UX (less flicker)
        element.classList.remove("do-not-drop");
        element.classList.remove("do-drop");
      }, 250);
    };

    _this.dragStart = function (event) {
      var element = event.target;
      var currentNode = _this.getIds(element);
      if (currentNode) {
        _this.draggedNode = currentNode;
      }
    };

    _this.drop = function (event) {
      // make sure we are dropping on the parent TD
      // so we can get the id/parentID
      var element = event.target;
      if (element.tagName !== "TD") {
        while (element.parentElement) {
          element = element.parentElement;
          if (element.tagName === "TD") {
            break;
          }
        }
      }
      var dropNode = _this.getIds(element);
      if (dropNode && _this.draggedNode) {
        if (
        // don't drop into itself
        _this.draggedNode.id !== dropNode.id &&
        // don't drop into it's own kids
        _this.draggedNode.id !== dropNode.parentId) {
          _this.props.update(parseInt(_this.draggedNode.id, 10), parseInt(dropNode.id, 10));
        }
      }
    };

    _this.dragEnter = function (event) {
      event.preventDefault();
      var element = event.target;
      if (element.tagName === "TD") {
        var dropNode = _this.getIds(element);
        if (dropNode && _this.draggedNode) {
          if (
          // don't drop into itself
          _this.draggedNode.id === dropNode.id ||
          // don't drop into it's own kids
          _this.draggedNode.id === dropNode.parentId) {
            element.classList.add("do-not-drop");
          } else {
            element.classList.add("do-drop");
          }
        }
      }
    };

    _this.drawDiagram = function () {
      var orgChart = _this.state.orgChart;

      var template = function template(p) {
        return "\n      <hidden data-id='" + p.id + "' />\n      <hidden data-parent-id='" + p.parentId + "' />\n      <h6>\n        " + p.title + " \n      </h6>\n      ";
      };
      var orgChartDiv = document.getElementById("org-chart");
      if (orgChartDiv) {
        _this.diagram = new google.visualization.OrgChart(orgChartDiv);

        google.visualization.events.addOneTimeListener(_this.diagram, "ready", function () {
          var nodes = window.document.getElementsByClassName("org-chart-node");
          each(nodes, function (node) {
            node.setAttribute("draggable", "true");
            node.addEventListener("dragstart", _this.dragStart);
            node.addEventListener("dragenter", _this.dragEnter);
            node.addEventListener("dragover", _this.dragEnter);
            node.addEventListener("dragexit", function () {
              return _this.draggedNode = null;
            });
            node.addEventListener("dragleave", _this.dragLeave);
            node.addEventListener("drop", _this.drop);
          });
        });

        var data = new google.visualization.DataTable();

        data.addColumn("string", "Name");
        data.addColumn("string", "Manager");
        data.addColumn("string", "ToolTip");

        // transform our domain model into a google charts 'view model'
        var positions = orgChart.map(function (p) {
          return [
          // using google chart template syntax
          { v: "" + p.id, f: template(p) },
          // stop the chart displaying a blank box if there is no parent
          !p.parentId || p.parentId === "0" ? null : "" + p.parentId,
          // display the position title
          p.title];
        });

        data.addRows(positions);

        _this.diagram.draw(data, {
          size: "small",
          allowHtml: true,
          nodeClass: "org-chart-node"
        });
      }
    };

    _this.state = {
      orgChart: _this.props.orgChart
    };
    return _this;
  }

  _createClass(OrgChart, [{
    key: "componentDidMount",
    value: function componentDidMount() {
      this.props.getOrgChart();
    }
  }, {
    key: "componentWillReceiveProps",
    value: function componentWillReceiveProps(nextProps) {
      this.setState({ orgChart: nextProps.orgChart });
    }
  }, {
    key: "componentDidUpdate",
    value: function componentDidUpdate(prevProps, prevState) {
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

  }, {
    key: "render",
    value: function render() {
      return __WEBPACK_IMPORTED_MODULE_0_react___default.a.createElement("div", { id: "org-chart", className: "org-chart" });
    }
  }]);

  return OrgChart;
}(__WEBPACK_IMPORTED_MODULE_0_react___default.a.Component);

OrgChart.PropTypes = {
  positions: __WEBPACK_IMPORTED_MODULE_1_react_prop_types___default.a.array,
  getOrgChart: __WEBPACK_IMPORTED_MODULE_1_react_prop_types___default.a.func,
  update: __WEBPACK_IMPORTED_MODULE_1_react_prop_types___default.a.func
};

OrgChart.defaultProps = {
  orgChart: []
};

/* harmony default export */ __webpack_exports__["default"] = (OrgChart);

/***/ })

},[21]);
});