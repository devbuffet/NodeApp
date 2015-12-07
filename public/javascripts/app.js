(function () {
  var app = angular.module('movies', ['ui.bootstrap']);
  
  // get the data
  app.controller('ListingCtrl', function ($scope, $http) {
    
    // movie data model
    $scope.Movie = {
      category: [
        { key: 'recent', friendly_name: 'New Release' },
        { key: 'featured', friendly_name: 'Featured' },
        { key: 'recent', friendly_name: 'Recent' },
        { key: 'recent_update', friendly_name: 'Recent (Update)' },
        { key: 'top', friendly_name: 'Top' }
      ],
      movies: [],
      selectedCategory: { key: null, friendly_name: 'Select Category' },
      availableOptions: [
        { id: 0, name: '50' },
        { id: 1, name: '60' },
        { id: 2, name: '70' },
        { id: 3, name: '80' },
        { id: 4, name: '90' }
      ],
      selectedOption: [],
      listingProgress: null,
      itemProgress: [],
      movieMessage: null,
      movieTitle: null,
      authorized: null
    };
    
    // authenticate the request
    $scope.authenticate = function () {
      $http.get('/user/auth/' + $scope.Movie.api_key)
        .success(function (resp) {
          if (resp != undefined) {
            if (resp.api_key == $scope.Movie.api_key) {
              // they are authorized
              $scope.Movie.authorized = true;
            }
          }
        });
    };
    
    // filter movie by title
    $scope.filterMovie = function (resp) {

      var movies = [];

      for (var i = 0; i < resp.length; i++) {
        var item = resp[i];
        if (item.title != undefined && item.title.toLowerCase().indexOf($scope.Movie.movieTitle) > -1) {
          movies.push(item);
        }
      }
      return movies;
    };
    
    // get movie listings based on category
    $scope.getMoviesListing = function () {

      $scope.Movie.authorized = true;
      
      // get selected category
      var selectedCategory = $scope.Movie.selectedCategory;
      
      // show please wait...
      $scope.Movie.movies = [];
      $scope.Movie.listingProgress = true;
      $scope.Movie.movieMessage = null;

      $http.get('/movies/api/list/' + selectedCategory.key)
        .success(function (resp) {
          
          // set movie data
          $scope.Movie.movies = ($scope.Movie.movieTitle == null || $scope.Movie.movieTitle.length == 0 ? resp : $scope.filterMovie(resp));
          
          // movie message
          $scope.Movie.movieMessage = $scope.Movie.movies.length + " results found for  " + selectedCategory.friendly_name;
          
          // default the rating to 50%          
          $scope.setRating(0, $scope.Movie.movies.length);
                    
          // clear please wait
          $scope.Movie.listingProgress = null;
        });
    };
    
    // defaults the rating
    $scope.setRating = function (indx, count) {
      // default rating is 50%
      for (var i = 0; i < count; i++) {
        $scope.Movie.selectedOption[i] = $scope.Movie.availableOptions[indx];
      }
    };
    
    // toggles category
    $scope.toggleCategory = function (item) {
      $scope.Movie.selectedCategory = item;
    };
    
    // get filtered rating
    $scope.getFilteredRating = function (index) {

      var threshold = $scope.Movie.selectedOption[index].name;
        
      // show please wait...
      $scope.Movie.itemProgress[index] = 'please wait...';

      $scope.Movie.movies[index].data.rating = null;

      $http.get('/movies/api/show/' + $scope.Movie.movies[index].key + '/' + threshold)
        .success(function (resp) {

          $scope.Movie.movies[index].data.rating = resp;

          if (resp.length > 0) {
            // hide message
            $scope.Movie.itemProgress[index] = null;
          }
          else {
            $scope.Movie.itemProgress[index] = 'No data found';
          }
        });
    };
  });
  
  // next controller...

} ());




