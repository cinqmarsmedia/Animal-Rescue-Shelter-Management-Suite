<?php 
//include('class.phpmailer.php');
//require 'class.phpmailer.php';

header('Access-Control-Allow-Origin: *');  
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: origin, content-type, accept");
header("Access-Control-Allow-Credentials: true");

$email= htmlspecialchars($_GET["email"]);
$firstname= htmlspecialchars($_GET["firstname"]);
$body = file_get_contents('ReminderEmail.html'); 


$body = str_replace('%firstname%', $firstname, $body); 

//echo $subject;

//----------EMAILER---------------

require 'PHPMailerAutoload.php';

$mail = new PHPMailer;

//$mail->SMTPDebug = 2;                               // Enable verbose debug output

$mail->isSMTP();                                      // Set mailer to use SMTP ; deliminated
$mail->SMTPDebug = 1;
$mail->Host = 'smtp.gmail.com';  // Specify main and backup SMTP servers
$mail->SMTPAuth = true;                               // Enable SMTP authentication
$mail->Username = '<email address>';                 // SMTP username
$mail->Password = '<password>';

//$mail->Username = 'devilscalculator@gmail.com';                 // SMTP username
//$mail->Password = '!QAZ@WSX1qaz2wsx';

                           // SMTP password
$mail->SMTPSecure = 'ssl';                            // Enable TLS encryption, `ssl` also accepted
$mail->Port =465;  // or 587                                  // TCP port to connect to

$mail->setFrom('*animalrescue*.org', '*ANIMAL RESCUE*');

$mail->addAddress($email, 'Volunteer');     // Add a recipient
$mail->isHTML(true);                                  // Set email format to HTML

$mail->Subject = "We Miss You!";
// make nice html message
$mail->Body    = $body;//MsgHTML(
$mail->AltBody = $altbody;

if(!$mail->send()) {
    echo 'Message could not be sent.';
    echo 'Mailer Error: ' . $mail->ErrorInfo;
} else {
    echo 'email sent';
}

?>