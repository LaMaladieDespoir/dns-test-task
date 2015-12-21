var React = require('react');
var PropTypes = React.PropTypes;
var DragSource = require('react-dnd').DragSource;
var DropTarget = require('react-dnd').DropTarget;
var findDOMNode = require('react-dom').findDOMNode;
var update  = require('react/lib/update');

//переменная содержит информацию о том куда положить элемент. (вверх,cредина,низ)
var how_to_add = false;

var categorySource = {
	beginDrag: function (props) {
		return {arriving:props.data.id_cat};
	},
	endDrag:function(props, monitor) {
		var item = monitor.getItem();
		var dropResult = monitor.getDropResult();

		//Drop на себя
		if (item.arriving === dropResult.self_id){
			return;
		}

		if (dropResult) {
			props.pushItem({
							view:'push',
							arriving:item.arriving,
							catcher:dropResult.catcher,
							sort:dropResult.sort,
							how_to_add:how_to_add
						});
		}
	}
};

var categoryTarget = {
	drop:function(props) {
		var out = {self_id:props.data.id_cat};
		if(props.data.is_category == 1 && how_to_add == 2){
			out.catcher = props.data.id_cat;
			out.sort = 0;
		}else{
			out.catcher = props.data.id_parent;
			out.sort = props.data.sort;
		}
		return out;
	},
	hover:function(props, monitor, component) {
		//координаты принимающего элемента
		var hoverBoundingRect = findDOMNode(component).getBoundingClientRect();
		//делим высоту на три
		var hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 3;
		// Координаты мыши пользователя
		var clientOffset = monitor.getClientOffset();
		var hoverClientY = clientOffset.y - hoverBoundingRect.top;

		//получаем три состояния наведения мыши на элемент 1 - навреху, 2 - по средине, 3 внизу;
		var hover_status = Math.ceil(hoverClientY/hoverMiddleY);
		how_to_add = hover_status;
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
		how_to_add:how_to_add
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
		console.log(event.target);
		$(event.target).parent().next('ul').toggle();

	},
	changeStyle:function(){
		console.log('changeStyle');
	},
	render: function() {
		var isDragging = this.props.isDragging;
		var how_to_add = this.props.how_to_add;
		var isOver = this.props.isOver;
		var style={color:'black'};

		if(isOver){
			style.backgroundColor='#BBFFFF';
			switch (how_to_add) {
				case 1:
					style.borderTop = '2px dotted green';
				break;
				case 3:
					style.borderBottom = '2px dotted green';
					break;
			}
		}

		var connectDragSource = this.props.connectDragSource;
		var connectDropTarget = this.props.connectDropTarget;

		if(this.props.data.is_category == 1){
			return connectDragSource(connectDropTarget(<span style={style} className="category" onClick={this.handlerFolderClick}>{this.props.data.name} {this.props.data.sort}</span>));
		}else{
			return connectDragSource(connectDropTarget(<span style={style} className="file">{this.props.data.name} {this.props.data.sort}</span>));
		}

	}
});

Category = DragSource('category', categorySource,collectDrag)(Category)|| Category;
Category = DropTarget('category', categoryTarget, collectDrop)(Category) || Category;
module.exports = Category;
