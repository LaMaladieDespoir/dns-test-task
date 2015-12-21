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
                        case 'brush':
			case 'getall':
			case 'push':
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

	public function render(){
		$methodName = $this->view."Render";
		$this->$methodName();
	}
        /**
         * Генерация JSON дерева всех элементов в БД
         */
	private function getallRender(){
            $items = $this->database->select('categories',
                            ['id_cat','id_parent','name','sort','is_category'],
                            ['ORDER' => 'categories.sort ASC']
                        );
            
            $root_items = array_filter($items, function($item){
                                                return $item['id_parent'] == 0;
                                            });

            $invers = [];
            foreach ($items as $a){
                $invers[$a['id_parent']][] = $a;
            }

            $tree = $this->createTree($invers, $root_items);
            print_r(json_encode($tree));
        }
        /**
         * Перенос item в другую категорию.
         */
	private function pushRender(){
            $arriving = (int)$_GET['arriving'];
            $catcher = (int)$_GET['catcher'];
            $sort = (int)$_GET['sort'];
            $how_to_add = (int)$_GET['how_to_add'];
            $catcher = (int)$_GET['catcher'];

            if($how_to_add == '3'){
                //добавить на следующую позицию
                $sort++;
            }

            //обновляем сортировку у следующих элементов
            //такой интересный синтаксис у фреймфорка, сам первый раз им пользуюсь.
            $items_update_sort = $this->database->select('categories','*',[
                    'AND'=>[
                        'sort[>=]' => $sort,
                        'id_parent' => $catcher
                    ]
                ]
            );
            //обновляем сортировку следующих за встовляемым элементов в категории
            foreach ($items_update_sort as $key => $item) {
                $sort_value = 1 + $key+$sort;
                $this->database->update('categories',[
                    'sort' => $sort_value
                ],[
                    'id_cat' => $item['id_cat']
                ]);
            }

            //меняем родителя у перетаскиваемого элемента
            $this->database->update('categories',[
                    'id_parent' => $catcher,
                    'sort'=>$sort
                ],[
                    'id_cat'=> $arriving
                ]
            );
            
            //причесываем для поддержания целостности базы, на тот случай если какой-то элемент из категории был изьят
            self::brushRender();
        }
        /**
         * Рекурсивно собираем дерево из массива
         */
        private function createTree($list, $parent){
            $tree = [];
            foreach ($parent as $k=>$l){
                if(isset($list[$l['id_cat']])){
                    $l['child'] = self::createTree($list, $list[$l['id_cat']]);
                }
                $tree[] = $l;
            } 
            return $tree;
        }
        /**
         * Метод обновляет сортировку всех категорий в БД
         */
        private function brushRender(){
            //Причесываем родительскую категрию
            self::brushCategory(0);
            $items = $this->database->select('categories','*',['is_category'=>1]);
            foreach ($items as $item) {
                self::brushCategory($item['id_cat']);
            }
	}
        /**
         * Метод обновляет сортировку категории
         */
        private function brushCategory($id_parent){
            $category_items = $this->database->select('categories','*',['id_parent'=>$id_parent,'ORDER' => 'categories.sort ASC']);
            foreach ($category_items as $key => $category) {
                $this->database->update('categories',[
                                                        'sort' => $key
                                                    ],[
                                                        'id_cat'=> $category['id_cat']
                                                    ]
                );
            }
        }
	private function closeRender(){
		exit('close');
	}
	private function errorRender(){
		exit('error');
	}
}
