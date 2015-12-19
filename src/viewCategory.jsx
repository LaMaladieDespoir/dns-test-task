var React = require('react');
var PropTypes = React.PropTypes;
var DragSource = require('react-dnd').DragSource;

var categorySource = {
	beginDrag: function (props) {
		return {};
	}
};

function collect(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
	}
}

var Category = React.createClass({
	propTypes: {
		connectDragSource: PropTypes.func.isRequired,
		isDragging: PropTypes.bool.isRequired,
		data:PropTypes.object.isRequired,
	},
	handlerFolderClick: function(event) {
		$(event.target).next('ul').toggle();
	},
	render: function() {
		var connectDragSource = this.props.connectDragSource;
		var isDragging = this.props.isDragging;
		return connectDragSource(<b onClick={this.handlerFolderClick}>{this.props.data.name}</b>);
	}
});

module.exports = Category;
module.exports = DragSource('category', categorySource, collect)(Category);
