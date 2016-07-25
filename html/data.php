<?php

	header('Content-Type:application/json; charset=utf-8');
	$data = file_get_contents('./data.json');
	echo $data;
?>