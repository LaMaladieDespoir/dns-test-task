<?php

$categories = [
	[
		'id_cat'=>1,
		'id_parent'=>0,
		'name'=>'folder 1',
		'order'=> 0
	],[
		'id_cat'=>2,
		'id_parent'=>0,
		'name'=>'folder 2',
		'order'=> 1
	],[
		'id_cat'=>3,
		'id_parent'=>2,
		'name'=>'folder 3',
		'order'=> 0
	],[
		'id_cat'=>4,
		'id_parent'=>2,
		'name'=>'folder 4',
		'order'=> 0
	],[
		'id_cat'=>5,
		'id_parent'=>4,
		'name'=>'folder 5',
		'order'=> 0
	],[
		'id_cat'=>6,
		'id_parent'=>0,
		'name'=>'folder 6',
		'order'=> 0
	]

];
$files = [
	[
		'id_file'=>1,
		'id_cat'=>2,
		'name'=>'file 1',
		'order'=> 0
	],[
		'id_file'=>2,
		'id_cat'=>2,
		'name'=>'file 2',
		'order'=> 1
	],[
		'id_file'=>3,
		'id_cat'=>2,
		'name'=>'file 3',
		'order'=> 0
	],[
		'id_file'=>4,
		'id_cat'=>3,
		'name'=>'file 4',
		'order'=> 0
	],[
		'id_file'=>5,
		'id_cat'=>5,
		'name'=>'file 5',
		'order'=> 0
	],[
		'id_file'=>6,
		'id_cat'=>5,
		'name'=>'file 6',
		'order'=> 0
	],[
		'id_file'=>7,
		'id_cat'=>0,
		'name'=>'file 7',
		'order'=> 0
	],[
		'id_file'=>8,
		'id_cat'=>0,
		'name'=>'file 8',
		'order'=> 0
	],[
		'id_file'=>9,
		'id_cat'=>4,
		'name'=>'file 9',
		'order'=> 0
	]
];


$arr =  flat2tree($categories,$files);
print_r(json_encode($arr));

function flat2tree(&$flat,$files){
    $tree = array();
    $nodeMap = array();

    $N = (is_array($flat)) ? count($flat) : 0;

    for ($i=0; $i<$N; ++$i){
        $node =& $flat[$i];
		$node['files']=findFiles($files,$node['id_cat']);
		$node['child'] = [];
        if (isset($nodeMap[$node['id_parent']])){
            $parent =& $nodeMap[$node['id_parent']];
            if (!isset($parent['child']) || !is_array($parent['child'])){
                $parent['child'] = array();
            }
            $parent['child'][] = $node;
            $nodeMap[$node['id_cat']] =& $parent['child'][count($parent['child']) - 1];
        }
        else{
            $tree[] = $node;
            $nodeMap[$node['id_cat']] =& $tree[count($tree) - 1];
        }
    }
    return $tree;
}

function findFiles($files,$id_cat){
	$out = [];
	foreach ($files as $file) {
		if($file['id_cat'] === $id_cat){
			$out[]=$file;
		}
	}
	return $out;
}
 ?>
