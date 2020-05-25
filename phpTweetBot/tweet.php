<?php

ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL & ~E_NOTICE);


$d = file_get_contents('data');
$d= json_decode($d);


$count=50;

$emojis=[😋,😀,😍,😊,☺️,😇,❤️,💛,💚,💙,💜];
$emojihearts=[❤️,💛,💚,💙,💜];

$hashtags=[
'#Rescue',
'#adoptdontshop',
'#Foster',
'#PetRescue',
'#Adoption',
'#PetAdoption',
'#AnimalLove',
'#AdoptMe',
//'#AdoptaMe',
'#savealife',
'#adoptdontshop'
];

$hashtagtwo=[
'#spca',
'#NYC',
'#petlovers',
'#urgent',
'@petfinder'];

if (rand(0,10)>6){
    $petemoji=[😺,😸,😹,😻,😽];
    array_push($hashtagtwo,'#catsoftwitter,#catlovers','#catlover','#cats');
    $petType='cat';

}else{
    $petemoji=[🐕,🐾,🐶];
    array_push($hashtagtwo,'#dogsoftwitter','#rescuedogs','#doglovers','#puppylove','#dogs');
    $petType='dog';

}


$key = '<petFinder key>';
$secret = '<petFinder secret>';
$api_endpoint = 'https://api.petfinder.com/v2/animals?type='.$petType.'&location=10001&status=adoptable'; // endpoint must support "Application-only authentication"



// request token
$basic_credentials = base64_encode($key.':'.$secret);
$tk = curl_init('https://api.petfinder.com/v2/oauth2/token');
curl_setopt($tk, CURLOPT_HTTPHEADER, array('Authorization: Basic '.$basic_credentials, 'Content-Type: application/x-www-form-urlencoded;charset=UTF-8'));
curl_setopt($tk, CURLOPT_POSTFIELDS, 'grant_type=client_credentials');
curl_setopt($tk, CURLOPT_RETURNTRANSFER, true);
$token = json_decode(curl_exec($tk));
curl_close($tk);

// use token
if (isset($token->token_type) && $token->token_type == 'Bearer') {
    $br = curl_init($api_endpoint);
    curl_setopt($br, CURLOPT_HTTPHEADER, array('Authorization: Bearer '.$token->access_token));
    curl_setopt($br, CURLOPT_RETURNTRANSFER, true);
    $response = json_decode(curl_exec($br));
    curl_close($br);

}




$count=count($response->animals);

for ($i=0;$i<$count;$i++){

if (isset($response->animals[$i]->photos[0])){

if (!in_array((string)$response->animals[$i]->id,$d)){

if (isset($tempi)){

if (strtotime($response->animals[$i]->status_changed_at)<$lowestdate){
$tempi=$i;
$lowestdate=strtotime($response->animals[$i]->status_changed_at);
}

}else{
$tempi=$i;
$lowestdate=strtotime($response->animals[$i]->status_changed_at);

}


}

}
}




$picture=$response->animals[$tempi]->photos[0]->full;

if (isset($response->animals[$tempi]->photos[1])){

$picturetwo=$response->animals[$tempi]->photos[1]->full;
}


$prefixtxt=[
"Come rescue",
"Come help",
"Come adopt",
"Come pick up",
"Come meet",
"Come snuggle",
"Come visit",
"Say hi to",
"Meet",
"Rescue",
"Help",
"Adopt",
"Pick up",
"Snuggle",
"Visit"
];


$suffixtxt=[

"now!",
"today!",
"ASAP!",
"pronto!",
"!",
"today!",
"before time runs out!",
"before it's too late!",
"today!",
"!",
"now!",
"soon!"



];


$explanatory=[

"'s such a cutie!",
"'s so sweet!",
" can be your best friend!",
" has so much love to give!",
"'s so affectionate!",
" wants to be your new buddy!",
"'s waiting for you!",
" wants to play!",
"'s ready for snuggles!",
" wants to meet you!",
" wants to love you!",
"'s the sweetest!",
"'s the cuddliest!",
" needs your help!",
" wants to come home with you!",
"'s your new best friend!",
" needs your love!",
" needs a friend!",
"'s the perfect companion!",
" needs your support!",
" needs your generosity!",
"'s the perfect friend!",
"'s the most wonderful pet!",
"'s the most adorable!",
"'s the loveliest!",
" needs a loving home!",
" needs your TLC!",
" wants to be part of your life!",
"'d love a RT!",
" needs as many RTs as possible!",
" needs this seen far and wide!",
" needs a furever home!",
" needs some RTs!",
" wants some hugs!",
" would love a RT or two!"

];



$hashnum=rand(0,count($hashtags)-1);
$explnum=rand(0,count($explanatory)-1);
$suffixnum=rand(0,count($suffixtxt)-1);
$prefixnum=rand(0,count($prefixtxt)-1);
$petemojinum=rand(0,count($petemoji)-1);
$emojisnum=rand(0,count($emojis)-1);
$hashtagtwonum=rand(0,count($hashtagtwo)-1);
$emojiheartsnum=rand(0,count($emojihearts)-1);


if ($response->animals[$tempi]->gender=="Female"){
$gender="She";
}else{
$gender="He";
}


$url='https://www.petfinder.com/petdetail/'.$response->animals[$tempi]->id;

$name=$response->animals[$tempi]->name;
echo $name;
$name=strtoupper(preg_replace('/\W.+|\W+/i', '', $name));


$tweet=$petemoji[$petemojinum].' '.$prefixtxt[$prefixnum].' #'.$name.' '.$suffixtxt[$suffixnum].' '.$hashtagtwo[$hashtagtwonum].' '.$gender.$explanatory[$explnum].' '.$hashtags[$hashnum].' '.$emojis[$emojisnum].' '.$url;


echo $tweet;
print_r($response);
/**/
if ($response->animals[$tempi]->id === NULL){
echo "firing";
unset($d[0]);
unset($d[1]);
unset($d[2]);
unset($d[3]);
unset($d[4]);
unset($d[5]);
unset($d[6]);
unset($d[7]);
unset($d[8]);
unset($d[9]);
unset($d[10]);
$d = array_values($d);
$d=json_encode($d);
file_put_contents('data', $d); 

    return;
}


//*******************************************************

                    require "inc/twitter_credentials.php";
                    require "vendor/autoload.php";
    
                    use Abraham\TwitterOAuth\TwitterOAuth;

$connection = new TwitterOAuth(CONSUMER_KEY, CONSUMER_SECRET, ACCESS_TOKEN, ACCESS_TOKEN_SECRET);

$media1 = $connection->upload('media/upload', ['media' => $picture]);
// && rand(0,10)>1
if (isset($picturetwo)){
$media2 = $connection->upload('media/upload', ['media' => $picturetwo]);



$parameters = [
    'status' => $tweet,
    'media_ids' => implode(',', [$media1->media_id_string, $media2->media_id_string])
    //'media_ids' => implode(',', [$media1->media_id_string, $media2->media_id_string])
];

}else{

$parameters = [
    'status' => $tweet,
    'media_ids' => [$media1->media_id_string]
];


}


$result = $connection->post('statuses/update', $parameters);

array_push($d,$response->animals[$tempi]->id);
$d=json_encode($d);
file_put_contents('data', $d); 

                ?>
           