exports.seed = function (knex) {
    return knex("movies")
        .del()
        .then(function () {
            return knex("movies").insert([
                {
                    title: "The Godfather",
                    director: "Francis Ford Coppola",
                    rate: 3,
                    genre: "Drama",
                    popular: true,
                    description:
                        "War hero Michael is the prodigal son of aging but fearsome crime patriarch Don Vito Corleone. When Michael returns home only to be thrust into an all-too-familiar world of hitmen, corrupt cops, and simmering mafia rivalries, he is forced to choose between his own path and the Corleone family legacy.",
                    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEjZ651J25IyTliHpDADptLvd74e2T-oEHnEKSc9XtTTNd_wfzH505o183AYwSOGsLFC5Pt6GOJa9bOxIJPInwFa9_TJdEABVb4pQ2SFD4cm-Q2VU4fyxmjrQkVNbEfTjTjN0NafE5fwOoJBrDBJgZY2mXpfKy9yvGz2QGxPEiD33BNyM452jGUu25oq/s320/godfather.jpg",
                },
                {
                    title: "Jujutsu Kaisen",
                    director: "Sunghoo Park",
                    rate: "0.00",
                    genre: "Anime",
                    popular: true,
                    description:
                        "Jujutsu Kaisen (呪術廻戦, rgh. \"Sorcery Battle\")[a] is a Japanese manga series written and illustrated by Gege Akutami. It was serialized in Shueisha's shōnen manga magazine Weekly Shōnen Jump from March 2018 to September 2024, with its chapters collected in 30 tankōbon volumes. The story follows high school student Yuji Itadori as he joins a secret organization of Jujutsu Sorcerers to eliminate a powerful Curse named Ryomen Sukuna, of whom Yuji becomes the host. Jujutsu Kaisen is a sequel to Akutami's Tokyo Metropolitan Curse Technical School, serialized in Shueisha's Jump Giga from April to July 2017, later collected in a tankōbon volume, retroactively titled as Jujutsu Kaisen 0, in December 2018.",
                    image: "https://static0.gamerantimages.com/wordpress/wp-content/uploads/2024/12/gojo-past-arc-jujutsu.jpg?q=70&fit=crop&w=1140&h=&dpr=1",
                },
                {
                    title: "Terminator 2: Judgement Day",
                    director: "James Cameron",
                    rate: 1,
                    genre: "Action",
                    popular: null,
                    description:
                        "A cyborg, identical to the one who failed to kill Sarah Connor, must now protect her ten year old son, John Connor, from a more advanced and powerful cyborg.",
                    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEg9KYz9Kjpa2r4KLwFBoD4BlgJFidOA6D_CL4Z7gPaczoIU-UbwYkA_txVVhOt3sGhISG18sUC3gnov5Z7ry08Pdtoi59yHH4sv2QAEnmPIOiUaNwU2yJRHQ3C1hvCgyleuOZ4RT59T53KM3mYDDckhSQDs03wZOm2fVeuOvi6L2tRl78zzdXxKpfDa/s320/terminator2.jpg",
                },
            ]);
        });
};
