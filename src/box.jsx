var React = require('react');
var PropTypes = React.PropTypes;
var DropTarget = require('react-dnd').DropTarget

var styleCss = {
		border:'2px solid black',
		height:'100px',
		width:'100px'
};

const boxTarget = {
	drop:function() {
		console.log('boxTarget.drop');
		return { name: 'Box' };
	}
};

function collect(connect, monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		isOver: monitor.isOver(),
		//canDrop: monitor.canDrop()
	}
}

var Box = React.createClass({
	propTypes: {
		connectDropTarget: PropTypes.func.isRequired
	},
	render: function() {
		var connectDropTarget = this.props.connectDropTarget;
		return connectDropTarget(<div style={styleCss}></div>);
	}
});


module.exports = DropTarget('category',boxTarget,collect)(Box);
