# Тестовое задание от DNS-shop

## Задача на реализацию подобного дерева 

[http://docs.sencha.com/extjs/4.2.1/extjs-build/examples/build/KitchenSink/ext-theme-neptune/#tree-reorder](http://docs.sencha.com/extjs/4.2.1/extjs-build/examples/build/KitchenSink/ext-theme-neptune/#tree-reorder)

## Нужно реализовать:
1. Сделать дерево как в примере (без кнопок Collapse All, Expand All), так же обратить внимание, что есть папки, а есть документы в папках.
2. Реализовать «перетаскивание» как папок целиком (с дочерними папками), так и документов по отдельности
3. При перетаскивании результат должен сохраняться в БД. Архитектура БД может быть любой.
4. При сохранении в БД, на клиентской части должен отображаться прогресс бар (как в примере).

## Требования:
1. Сохранение должно работать через AJAX
2. Обработка клиентских событий должна быть реализована только на JavaScript с использованием jquery (с любыми расширениями и плагинами).  ***Вот тут я и проперся, сделав на react.js***
3. Серверная часть на PHP 5.5 
4. Базу данных использовать MySQL 
5. В проект должна быть включена локальная база данных, таблицы должны быть заполнены данными.

## Цель задачи проверить следующие навыки:
* Знание My SQL
* Знание JavaScript и фреймворка jQuery
* Знание AJAX
* Знание PHP
* Умение верстать страницы на основе примеров.

Ресурсы (картинки и все необходимое) можно взять из примера. Дизайн не важен, но если будет похож на исходный пример, то хорошо.

## Срок реализации:
1 неделя (чем быстрее, тем лучше)

## SQL DUMP
```sql
CREATE TABLE IF NOT EXISTS `categories` (
  `id_cat` int(11) NOT NULL,
  `id_parent` int(11) NOT NULL,
  `name` varchar(255) NOT NULL,
  `sort` int(11) NOT NULL DEFAULT '0',
  `is_category` tinyint(1) NOT NULL DEFAULT '1'
) ENGINE=InnoDB AUTO_INCREMENT=12 DEFAULT CHARSET=latin1;

INSERT INTO `categories` (`id_cat`, `id_parent`, `name`, `sort`, `is_category`) VALUES
(1, 0, 'folder 1', 0, 1),
(2, 0, 'folder 2', 1, 1),
(3, 0, 'folder 3', 2, 1),
(4, 2, 'folder 4', 1, 1),
(5, 0, 'folder 5', 3, 1),
(6, 5, 'folder 6', 0, 1),
(7, 2, 'file 1', 0, 0),
(8, 2, 'file 2', 2, 0),
(9, 2, 'file 3', 3, 0),
(10, 2, 'file 4', 4, 0),
(11, 4, 'file 5', 0, 0);

ALTER TABLE `categories`
  ADD PRIMARY KEY (`id_cat`),
  ADD KEY `parent` (`id_parent`);
  
ALTER TABLE `categories`
  MODIFY `id_cat` int(11) NOT NULL AUTO_INCREMENT,AUTO_INCREMENT=12;
  ```

## Результат
[http://dns-tree.vostok-remont.ru](http://dns-tree.vostok-remont.ru/)
