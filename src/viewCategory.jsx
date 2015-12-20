var React = require('react');
var PropTypes = React.PropTypes;
var DragSource = require('react-dnd').DragSource;
var DropTarget = require('react-dnd').DropTarget;
var findDOMNode = require('react-dom').findDOMNode;
var update  = require('react/lib/update');

var categorySource = {
	beginDrag: function (props) {
		return {arriving:props.data.id_cat};
	},
	endDrag:function(props, monitor) {
		var item = monitor.getItem();
		var dropResult = monitor.getDropResult();

		if (dropResult) {
			console.info('поймал');
			console.log(item);
			console.log(dropResult);
		}
	}
};

//переменная содержит информацию о том куда положить элемент. (вверх,низ)
var typeOver = false;

var categoryTarget = {
	drop:function(props) {
		console.warn('categoryTarget.drop');
		return {сatcher:props.data.id_cat};
	},
	hover:function(props, monitor, component) {

		//координаты принимающего элемента
		var hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
		//высчитываем расстояние от окна браузера до половины элемента по горизонтали
		var hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
		// Координаты мыши пользователя
		var clientOffset = monitor.getClientOffset();
		var hoverClientY = clientOffset.y - hoverBoundingRect.top;
		var nextElement = (hoverClientY > hoverMiddleY)?true:false;

		typeOver = nextElement;

		//console.log(component);
		console.log(monitor.isOver());

		props.reRender();
	}
};

function collectDrag(connect, monitor) {
	return {
		connectDragSource: connect.dragSource(),
		isDragging: monitor.isDragging(),
	}
}
function collectDrop(connect,monitor) {
	return {
		connectDropTarget: connect.dropTarget(),
		canDrop: monitor.canDrop(),
		isOver: monitor.isOver(),
		typeOver:typeOver
	}
}

var Category = React.createClass({
	propTypes: {
		connectDragSource: PropTypes.func.isRequired,
		isDragging: PropTypes.bool.isRequired,
		data:PropTypes.object.isRequired,
	},
	getInitialState: function() {
		return {};
	},
	handlerFolderClick: function(event) {
		$(event.target).next('ul').toggle();
	},
	changeStyle:function(){
		console.log('changeStyle');
	},
	render: function() {
		var isDragging = this.props.isDragging;
		var typeOver = this.props.typeOver
		var isOver = this.props.isOver;

		if(isOver){
			var style = (typeOver)?{color:'red'}:{color:'green'};
		}else{
			var style = {color:'black'};
		}

		var connectDragSource = this.props.connectDragSource;
		var connectDropTarget = this.props.connectDropTarget;
		return connectDragSource(connectDropTarget(<b style={style} onClick={this.handlerFolderClick}>{this.props.data.name}</b>));
	}
});

Category = DragSource('category', categorySource,collectDrag)(Category)|| Category;
Category = DropTarget('category', categoryTarget, collectDrop)(Category) || Category;
module.exports = Category;
