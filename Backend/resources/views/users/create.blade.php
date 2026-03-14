<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>
<body>
    <form method="POST" action="/users/store">
        @csrf

    <input type="text" name="name" placeholder="Nom"><br>
    <input type="email" name="email" placeholder="Email"><br>
    <input type="number" name="age" placeholder="Age"><br>
    <button type="submit">Ajouter</button>
</form>

</body>
</html>