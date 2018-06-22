<?php

$method = $_SERVER['REQUEST_METHOD'];

$project_name = "QASA (Мебель)";
$admin_email  = "sales@qasa.kz, client@marketing-time.kz";
$server_mail = "<info@qasa.kz>";
$form_subject = "Заявка";

$c = true;
if ( $method === 'POST' ) {

	foreach ( $_POST as $key => $value ) {
		if ( $value != "") {
			$message .= "
			" . ( ($c = !$c) ? '<tr>':'<tr style="background-color: #f8f8f8;">' ) . "
				<td style='padding: 10px; border: #e9e9e9 1px solid;'><b>$key</b></td>
				<td style='padding: 10px; border: #e9e9e9 1px solid;'>$value</td>
			</tr>
			";
		}
	}
} 

$message = "<table style='width: 100%;'>$message</table>";

function adopt($text) {
	return '=?UTF-8?B?'.Base64_encode($text).'?=';
}

$headers = "MIME-Version: 1.0" . PHP_EOL .
"Content-Type: text/html; charset=utf-8" . PHP_EOL .
'From: '.$project_name.' '.$server_mail. PHP_EOL .
'Reply-To: '.$admin_email.'' . PHP_EOL;

mail($admin_email, adopt($form_subject), $message, $headers);

if($_POST['info'] == 'Скачать каталог') {
	$file_subject = "Каталог";
	$file_name = "Каталог.pdf";
	$file_content = chunk_split(base64_encode(file_get_contents('./files/'.$file_name)));
	$uid = md5(uniqid(time()));
	
	$file_header = "From: ".$project_name." ".$server_mail."\r\n";
	$file_header .= "Reply-To: ".$admin_email."\r\n";
	$file_header .= "MIME-Version: 1.0\r\n";
	$file_header .= "Content-Type: multipart/mixed; boundary=\"".$uid."\"\r\n\r\n";					
	
	// message & attachment
	$file_message = "--".$uid."\r\n";
	$file_message .= "Content-type:text/plain; charset=iso-8859-1\r\n";
	$file_message .= "Content-Transfer-Encoding: 7bit\r\n\r\n";
	$file_message .= "--".$uid."\r\n";
	$file_message .= "Content-Type: application/octet-stream; name=\"".$file_name."\"\r\n";
	$file_message .= "Content-Transfer-Encoding: base64\r\n";
	$file_message .= "Content-Disposition: attachment; filename=\"".$file_name."\"\r\n\r\n";
	$file_message .= $file_content."\r\n\r\n";
	$file_message .= "--".$uid."--";

	mail($_POST['email'], adopt($file_subject), $file_message, $file_header);
}