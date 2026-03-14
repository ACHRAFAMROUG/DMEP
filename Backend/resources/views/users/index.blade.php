<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <h1>Liste Users</h1>

    @foreach($users as $user)
        <a href="/users/{{$user->id}}">
            {{$user->name}}
        </a><br>
    @endforeach

</body>
</html>