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
                    title: "Dumb and Dumber",
                    director: "The Farely Brothers",
                    rate: 2,
                    genre: "Comedy",
                    popular: false,
                    description:
                        "After a woman leaves a briefcase at the airport terminal, a dumb limo driver and his dumber friend set out on a hilarious cross-country road trip to Aspen to return it.",
                    image: "https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgN8s4NCh5G6-Az_gWfnMm0XYUT2V7CV83W63s3YvmXYQA5t9-VJUI5dVQILDVdQNCMBPt71LxsReK5AoZjps0K5WPCaxumAi2zFxt-cdZUwzWEgOTLinyU-18N1YK7NlQyCSXfWWp--XX9NZPWH7ttjoQTq-s65Gx6ZXjnhiFhsRzzKRAqtMUm8JQy/s320/dumb_and_dumber.jpg",
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
