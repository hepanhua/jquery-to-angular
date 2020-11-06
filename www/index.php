<?php
// ini_set('memory_limit','-1');
	// phpinfo();
	include ('./config/config.php');
	$app = new Application();
	init_lang();
	init_setting();
	$app->run();
?>