var React = require('react');
var PropTypes = React.PropTypes;
var DragSource = require('react-dnd').DragSource;

var categorySource = {
	beginDrag: function (props) {
		console.info('beginDrag');
		console.log(props.data.id_cat);
		return {id_cat:props.data.id_cat};
	},
	endDrag:function(props, monitor) {
		var item = monitor.getItem();
		var dropResult = monitor.getDropResult();
		console.info('endDrag');
		console.log(item);

		if (dropResult) {
			console.log(dropResult);
		}else{
			console.log('нет получаетля');
		}
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
		var isDragging = this.props.isDragging;


		var connectDragSource = this.props.connectDragSource;
		return connectDragSource(<b onClick={this.handlerFolderClick}>{this.props.data.name}</b>);
	}
});

//module.exports = Category;
module.exports = DragSource('category', categorySource, collect)(Category);
