import React from 'react';
import PropTypes from 'prop-types';
import EllipseTool from '../classes/tools/ellipseTool';
import PencilTool from '../classes/tools/pencilTool';

class Toolbar extends React.Component {
  static propTypes = {
    appInterface: PropTypes.object.isRequired,
    onToolSelect: PropTypes.func.isRequired,
  };

  constructor (...args) {
    super(...args);

    this.tools = [
      {
        id: 'ellipse',
        name: 'Ellipse Tool',
        tool: new EllipseTool(this.props.appInterface),
        icon: `www/images/toolbar/pencil.png`,
      },
      {
        id: 'pencil',
        name: 'Pencil Tool',
        tool: new PencilTool(this.props.appInterface),
        icon: `www/images/toolbar/pencil.png`,
      },
    ];
    this.state = {
      activeTool: this.tools[0],
    };
  }

  componentDidMount () {
    this.props.onToolSelect(this.state.activeTool.tool);
  }

  selectTool = (tool) => {
    this.setState({
      activeTool: tool,
    });
    this.props.onToolSelect(tool.tool);
  }

  render () {
    return (
      <div id="toolbar">
        { this.tools.map(tool => this.renderTool(tool)) }
      </div>
    );
  }

  renderTool (tool) {
    return (
      <button
        key={ tool.id }
        className={ tool == this.state.activeTool ? 'active' : 'inactive' }
        onClick={ () => this.selectTool(tool) }
      >
        <img src={ tool.icon } />
      </button>
    );
  }
}

module.exports = Toolbar;
