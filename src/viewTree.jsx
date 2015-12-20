var React = require('react');
var $ = require('jquery-browserify');
var DragDropContext = require('react-dnd').DragDropContext;
var HTML5Backend = require('react-dnd-html5-backend');
var Category = require('./viewCategory');

var Box = require('./box');

var DnsTree = React.createClass({
	getInitialState: function() {
		return {tree:[]};
	},
	componentDidMount: function() {
		this.refreshData();
	},
	refreshData: function(){
		$.getJSON('/ajax.php',{action:'get'},function(data) {
			console.log(data);
			this.setState({
				tree:data,
			});
		}.bind(this));
	},
	moveCategory:function(){
		console.log('DnsTree.moveCategory');
	},
	loopCategory: function(categories,files){
		return (<ul>{categories.map(function(category,ikey){
						var child;
						if (category.child.length || category.files.length) {
							child = this.loopCategory(category.child,category.files);
						}else{
							child = null;
						}
						return (<li key={ikey}><Category data={category} moveCategory={this.moveCategory}/>{child}</li>);
					}.bind(this))}

					{files.map(function(file,ikey){
						return (<li key={ikey+100}>{file.name}</li>);
					}.bind(this))}
			</ul>);
	},
	render: function() {
		return (<div>
			{this.loopCategory(this.state.tree,[])}
				<Box />
			</div>);
	}
});

module.exports = DragDropContext(HTML5Backend)(DnsTree);
