<?php
require 'vendor/autoload.php';

$app = new miniController();
$app->render();

class miniController{
	private $get;
	private $view;
        private $database;
	function __construct(){
		if (!isset($_GET['view'])){
			$this->view = 'error';
			return;
		}
		switch ($_GET['view']) {
			case 'getall':
			case 'add':
			case 'open':
			case 'close':
				$this->view = $_GET['view'];
				break;
			default:
				$this->view = 'error';
				return;
		}
                $this->database = new medoo([
			'database_type' => 'mysql',
			'database_name' => 'dns_tree',
			'server' => 'localhost',
			'username' => 'dns_tree',
			'password' => 'dns_treedns_tree',
			'charset' => 'utf8',
		]);
	}

	function render(){
		$methodName = $this->view."Render";
		$this->$methodName();
	}

	private function getallRender(){
            $categories = $this->database->select('categories',
                            ['id_cat','id_parent','name','sort','open']
                        );
            $files = $this->database->select('files',
                            ['id_file','id_cat','name','sort']
                        );
            $out = self::flat2tree($categories,$files);
            print_r(json_encode($out));
	}

	private function addRender(){
		exit('add');
	}
	private function openRender(){
		exit('open');
	}
	private function closeRender(){
		exit('close');
	}
	private function errorRender(){
		exit('error');
	}

        private static function flat2tree(&$flat,$files){
            $tree = array();
            $nodeMap = array();

            $N = (is_array($flat)) ? count($flat) : 0;

            for ($i=0; $i<$N; ++$i){
                $node =& $flat[$i];
                       $node['files']=  self::findFiles($files,$node['id_cat']);
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

        private static function findFiles($files,$id_cat){
               $out = [];
               foreach ($files as $file) {
                       if($file['id_cat'] === $id_cat){
                               $out[]=$file;
                       }
               }
               return $out;
        }
}
