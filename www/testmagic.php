<?php
$finfo = finfo_open(FILEINFO_MIME,"/usr/local/share/misc/magic.mgc"); // return mime type ala mimetype extension

if (!$finfo) {
    echo "Opening fileinfo database failed";
     exit();
}

/* get mime-type for a specific file */
$filename = "/path/to/filename";
echo finfo_file($finfo, $filename);

/* close connection */
finfo_close($finfo);
?>
