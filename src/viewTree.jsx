var React = require('react');
var $ = require('jquery-browserify');
var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd-html5-backend');
var Category = require('./viewCategory');

var DnsTree = React.createClass({
	getInitialState: function() {
		return {
			tree:[],
			loading:false
		};
	},
	componentDidMount: function() {
		this.refreshData();
	},
	refreshData: function(){
		$.getJSON('/ajax.php',{view:'getall'},function(data) {
			console.log(data);
			this.setState({
				tree:data,
				loading:false,
			});
		}.bind(this));
	},
	pushItem: function(request_var){
		this.setState({
			loading:true,
		});
		var context =this;
		$.get('/ajax.php',request_var).done(function( data ) {
			context.refreshData();
		});

	},
	reRender: function(){
		this.forceUpdate();
	},
	loopCategory: function(categories,files){
		return (<ul>{categories.map(function(category,ikey){
						var child;
						if (category.is_category == 1 && ('child' in category)) {
							child = this.loopCategory(category.child,category.files);
						}else{
							child = null;
						}
						return (<li key={ikey}><Category
							data={category}
							reRender={this.reRender}
							pushItem={this.pushItem}
							/>{child}</li>);
					}.bind(this))}
				</ul>);
	},
	render: function() {
		var classHtml = (this.state.loading)?'loading':'';
		var loading = (this.state.loading)?<div className="loader"></div>:'';
		return (<div className={classHtml}>
					<div>{this.loopCategory(this.state.tree,[])}</div>
					{loading}
				</div>);
	}
});

module.exports = DragDropContext(HTML5Backend)(DnsTree);
