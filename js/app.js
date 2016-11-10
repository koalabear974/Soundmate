//https://github.com/brandly/angular-youtube-embed youtube api
(function (){
	var app = angular.module("soundmateApp", ['ngCookies','youtube-embed']);
	// var appLocal = "/Soundmate/";
	var appLocal = "/";

	app.filter('capitalize', function() {
	    return function(input) {
	      return (!!input) ? input.charAt(0).toUpperCase() + input.slice(1) : '';
	    }
	});

	String.prototype.capitalize = function() {
	    return this.charAt(0).toUpperCase() + this.slice(1);
	}

	app.service('LoginService', ['$http', '$q', '$cookieStore', function($http, $q, $cookieStore){
		var that=this;
		var currentUser=null;
		var response=null;

		this.login = function (user) {
			var deferred = $q.defer();
			this.currentUser=null;
			this.response=null;

			if(this.response) {
				deferred.resolve(this.response);	
			} else {
				$http.post(appLocal+'sys/users/login.php',user).success(function(data) {
					data.user=="null" ? that.currentUser=null : that.setCurrentUser(data.user);
					this.response=data.response;
					deferred.resolve(data.response);
				});
			}

			return deferred.promise;
		};

		this.logout = function (){
			$cookieStore.remove('userCooks');
		}

		this.getCurrentUser = function (){
			return that.currentUser;
		};

		this.setCurrentUser = function (user){
			$cookieStore.put('userCooks', user);
			that.currentUser = user;
		};

		this.setCurrentCircle = function (circle_id){
			that.currentUser.current_circle=circle_id;
			that.setCurrentUser(that.currentUser);
		};

		this.setCurrentMusic = function (music_id){
			that.currentUser.current_music=music_id;
			that.setCurrentUser(that.currentUser);
		};

		this.checkCookie = function (){
			var cooks = $cookieStore.get('userCooks');
			if(cooks == null || cooks==undefined || cooks==""){
				return false;
			}else{
				that.setCurrentUser(cooks);
				return true;
			}
		};

		this.getUsername = function (){
			if(that.currentUser!=null){
				return that.currentUser["user_name"];
			}else{
				return "";
			}
		};

		this.getUserCircle = function (){
			if(that.currentUser!=null && that.currentUser["current_circle"]!=0 ){
				return that.currentUser["current_circle"];
			}else{
				return "";
			}
		};

		this.getUserMusic = function (){
			if(that.currentUser!=null && that.currentUser["current_music"]!=0 ){
				return that.currentUser["current_music"];
			}else{
				return "";
			}
		};

		this.getUserId = function (){
			if(that.currentUser!=null){
				return that.currentUser["user_id"];
			}else{
				return "";
			}
		};

		this.isConnected = function(){
			if(that.currentUser!=null){
				return true;
			}else{
				if(that.checkCookie()){
					return true;
				}else{
					return false;
				}
			}
		};
	}]);

	app.controller("menuController", ['$http', '$scope',"$timeout", "LoginService", function($http,$scope, $timeout,LoginService){
		var that=this;
		var result=null;
		var defaultTab=1;
		var showBlackLoadingScreen=false;
		var showWhiteLoadingScreen=false;
		
		this.selectTab = function (val) {
			$scope.tab = val;
			if($("#collapseSidebar").is(':visible')){
				this.collapseMenu();
			}
		};
		
		this.isSelected = function (val) {
			return $scope.tab === val;
		};

		this.isConnected = function (){
			return LoginService.isConnected();
		};

		this.isAdmin = function (){
			return LoginService.isAdmin();
		};

		this.getUsername = function (){
			return LoginService.getUsername();
		};

		this.getUserCircle = function (){
			return LoginService.getUserCircle();
		};


		this.showLoadingScreen = function (show,white){
			if(show){
				$(".loadingGif").hide();
				if(white){
					that.showWhiteLoadingScreen=true;
				}else{
					that.showBlackLoadingScreen=true;
				}
				$(".loadingGif").fadeIn(500);
			}else{
				$(".loadingGif").fadeOut(500, function (){
					if(white){
						that.showWhiteLoadingScreen=false;
					}else{
						that.showBlackLoadingScreen=false;
					}
					$(".loadingGif").hide();	
				});
			}
		};

		this.fadeCurrentTab= function(hide,callback){
			if(hide){
				$(".cover-container").fadeOut(500,function(){
					if(callback){
						callback();
					}
				});
			}else{
				$(".cover-container").fadeIn(500,function(){
					if(callback){
						callback();
					}
				});
			}
		};

		this.changeBackgroundColor= function(white,callback){
			if(white){
				$("body").animate({backgroundColor:"#eee"},{ duration: 600, queue: false });
				$("body").animate({color:"black"},{ duration: 600, queue: false });
				$("a").animate({color:"black"},{ duration: 600, queue: false });
				// $("a:hover").animate({"border-bottom":"2px solid black"},{ duration: 600, queue: false });
				$(".brandLogo#1").animate({opacity:0},{ duration: 600, queue: false });
				$(".brandLogo#2").animate({opacity:1},{ duration: 600, queue: false });
			}else{
				$("body").animate({backgroundColor:"#333"},{ duration: 600, queue: false });
				$("body").animate({color:"white"},{ duration: 600, queue: false });
				$("a").animate({color:"white"},{ duration: 600, queue: false });
				// $("a:hover").animate({"border-bottom":"2px solid white"},{ duration: 600, queue: false });
				$(".brandLogo#1").animate({opacity:1},{ duration: 600, queue: false });
				$(".brandLogo#2").animate({opacity:0},{ duration: 600, queue: false });
			}
			if(callback){
				setTimeout(callback, 600);
			}
		};

		this.changeTab=function(tab){
			if(tab==1){
				
				that.showLoadingScreen(true,true);
				that.fadeCurrentTab(true,function(){
					// console.log("finish hide");
				});
				that.changeBackgroundColor(false,function (){
					// console.log("finish change color");
					$scope.$apply(function () {
						$scope.tab=1;
					});
					that.showLoadingScreen(false,true);	
					that.fadeCurrentTab(false);
				});
			}else{
				that.showLoadingScreen(true,false);
				that.fadeCurrentTab(true,function(){
					// console.log("finish hide");
				});
				that.changeBackgroundColor(true,function (){
					// console.log("finish change color");
					$scope.$apply(function () {
						$scope.tab=2;
					});
					that.showLoadingScreen(false,false);	
					that.fadeCurrentTab(false);
				});
			}
		};

		this.login = function (){
			this.user={
				'user_name':$scope.user_name,
				'password':$scope.password
			}

			if(this.user["user_name"]==undefined || this.user["user_name"]=="" ){
				that.result={value:false,status:"Le pseudonyme est nécessaire"};
				$timeout(function(){that.result = null}, 5000);
				$scope.password="";
			}else{
				if(this.user["password"]==undefined || this.user["password"]==""){
					that.result={value:false,status:"Le mot de passe est nécessaire"};
					$timeout(function(){that.result = null}, 5000);
					$scope.password="";
				}else{
					LoginService.login(this.user).then(function(result){
						that.result=result;
						$timeout(function(){
							that.result = null;
							if(result.value){
								$scope.$broadcast("connection");
								if(LoginService.getUserCircle()){
									$(".cover-container").hide();
									that.changeTab(2);
								}else{
									$scope.tab = 1;
								}
							}
						}, 2000);

						
						$scope.password="";
					});
				}
			}
		};

		this.logout = function (){
			LoginService.logout();
			$http.get(appLocal+'sys/users/logout.php?user_id='+LoginService.getUserId()).then(function(data) {
				window.location.reload();
			},function(data) {
				window.location.reload();
			});
		};

		$scope.circleChanged = function (){
			that.showLoadingScreen(true,false);
			that.fadeCurrentTab(true,function(){
				// console.log("finish hide");
				that.changeBackgroundColor(true,function (){
					// console.log("finish change color");
					$scope.$apply(function () {
						$scope.tab=2;
					});
					that.showLoadingScreen(false,false);	
					that.fadeCurrentTab(false);
				});
			});
		};

		if(LoginService.isConnected()){
			if(LoginService.getUserCircle()){
				$(".cover-container").hide();
				this.changeTab(2);
			}else{
				$scope.tab = 1;
			}
		}else{
			$scope.tab = null;
		}


	}]);

	app.service('Database', ['$http', '$q', 'LoginService', function($http, $q, LoginService){
		var that = this;

		this.findKey = function (array,key){
			for (var i = array.length - 1; i >= 0; i--) {
				if(array[i].key==key){
					return i;
				}
			};
			return false;
		};

		this.getPublicCircles = function(reload){
			var deferred = $q.defer();
			if(reload){
				this.circles=null;
			}

			if(this.circles) {
				deferred.resolve(this.circles);	
			} else {
				var currentUser=LoginService.getCurrentUser();
				if(currentUser!= null){
					$http.get(appLocal+'sys/circles/getPublicCirclesList.php').success(function(data) {
						that.circles = data;
						deferred.resolve(that.circles);
						console.log(data);
					});
				}else{
					that.circles = null;
					deferred.resolve(that.circles);
				}
				
			}

			return deferred.promise;
		};

		this.getPrivateCircles = function(reload){
			var deferred = $q.defer();
			if(reload){
				this.circles=null;
			}

			if(this.circles) {
				deferred.resolve(this.circles);	
			} else {
				var currentUser=LoginService.getCurrentUser();
				if(currentUser!= null){
					
					$http.get(appLocal+'sys/circles/getPrivateCirclesList.php?user_id='+currentUser.user_id).success(function(data) {
						that.circles = data;
						deferred.resolve(that.circles);
					});
					
				}else{
					that.circles = null;
					deferred.resolve(that.circles);
				}
				
			}

			return deferred.promise;
		};

		this.registerCircle = function(circle){
			var deferred = $q.defer();
			var currentUser=LoginService.getCurrentUser();
			if(currentUser!= null){
				$http.post(appLocal+'sys/circles/registerCircle.php?user_id='+currentUser.user_id,circle).success(function(data) {
					that.result = data;
					deferred.resolve(that.result);
				});
			}else{
				that.result = null;
				deferred.resolve(that.result);
			}

			return deferred.promise;
		};

		this.addMusicToCircle = function(circle){
			var deferred = $q.defer();
			var currentUser=LoginService.getCurrentUser();
			if(currentUser!= null){
				$http.post(appLocal+'sys/music/addMusic.php?user_id='+currentUser.user_id,circle).success(function(data) {
					that.result = data;
					deferred.resolve(that.result);
				});
			}else{
				that.result = null;
				deferred.resolve(that.result);
			}

			return deferred.promise;
		};

		this.addUserToCircle = function(user){
			var deferred = $q.defer();
			
			$http.post(appLocal+'sys/circles/addUserToCircle.php',user).success(function(data) {
				that.result = data;
				deferred.resolve(that.result);
			});

			return deferred.promise;
		};

		this.setCurrentCircle = function(circle_id){
			var deferred = $q.defer();
			var currentUser=LoginService.getCurrentUser();
			if(currentUser!= null && circle_id!=null){
				
				$http.get(appLocal+'sys/users/setCurrentCircle.php?user_id='+currentUser.user_id+'&circle_id='+circle_id).success(function(data) {
					that.result = data;
					if(data){
						LoginService.setCurrentCircle(circle_id);
					}
					deferred.resolve(that.result);
				});
				
			}else{
				that.result = null;
				deferred.resolve(that.result);
			}

			return deferred.promise;
		};

		this.setCurrentMusic = function(music_id){
			var deferred = $q.defer();
			var currentUser=LoginService.getCurrentUser();
			if(currentUser!= null && music_id!=null){
				$http.get(appLocal+'sys/users/setCurrentMusic.php?user_id='+currentUser.user_id+'&music_id='+music_id+"&circle_id="+currentUser.current_circle).success(function(data) {
					that.result = data;
					if(data){
						LoginService.setCurrentMusic(music_id);
					}else{
						LoginService.setCurrentMusic(0);
					}
					deferred.resolve(that.result);
				});
				
			}else{
				that.result = null;
				deferred.resolve(that.result);
			}

			return deferred.promise;
		};

		this.getUsersLinked = function(reload,circle_id){
			var deferred = $q.defer();
			if(reload){
				this.usersLinked=null;
			}

			if(this.usersLinked) {
				deferred.resolve(this.usersLinked);	
			} else {
				$http.get(appLocal+'sys/users/getUsersLinked.php?circle_id='+circle_id).success(function(data) {
					that.usersLinked = data;
					deferred.resolve(that.usersLinked);
				});
			}

			return deferred.promise;
		};

		this.getUsersLinkedList = function(reload,circle_id){
			var deferred = $q.defer();
			if(reload){
				this.usersLinked=null;
			}

			if(this.usersLinked) {
				deferred.resolve(this.usersLinked);	
			} else {
				$http.get(appLocal+'sys/users/getUsersLinkedList.php?circle_id='+circle_id).success(function(data) {
					that.usersLinked = data;
					deferred.resolve(that.usersLinked);
				});
			}

			return deferred.promise;
		};

		this.getMusicLinked = function(reload,circle_id){
			var deferred = $q.defer();
			if(reload){
				this.musicLinked=null;
			}

			if(this.musicLinked) {
				deferred.resolve(this.musicLinked);	
			} else {
				$http.get(appLocal+'sys/music/getMusicLinked.php?circle_id='+circle_id).success(function(data) {
					that.musicLinked = data;
					deferred.resolve(that.musicLinked);
				});
			}

			return deferred.promise;
		};

		this.getUserCircle = function (reload){
			var deferred = $q.defer();
			if(reload){
				this.circle=null;
			}

			if(this.circle) {
				deferred.resolve(this.circle);	
			} else {
				var currentUser=LoginService.getCurrentUser();
				if(currentUser!= null){
					$http.get(appLocal+'sys/circles/getCircle.php?circle_id='+currentUser["current_circle"]).success(function(data) {
						that.circle = data;
						if(that.circle.length!=0){
							deferred.resolve(that.circle);
						}else{
							deferred.resolve(false);
						}
					});
				}else{
					that.circle = null;
					deferred.resolve(that.circle);
				}
				
			}

			return deferred.promise;
		};

		this.getUser = function (reload){
			return LoginService.getCurrentUser();;
		};
	}]);

	app.controller('CircleController', ['$timeout', '$scope', '$http', "Database", function($timeout,$scope, $http, Database){
		var that = this;
		this.result=null;
		this.configureCircleBool = false;
		this.privateCircles = [];
		this.publicCircles = [];
		this.usersLinked = [];


		Database.getPublicCircles(false).then(function(circles){
			that.publicCircles=circles;
		});

		Database.getPrivateCircles(false).then(function(circles){
			that.privateCircles=circles;
		});

		$scope.editCircle = function (printer_id) {
			key=Database.findKey(that.circles,circle_id);
			$scope.circle_name = that.circles[key].value.circle_name;
			$scope.circle_id = that.circles[key].value.circle_id;
			$scope.private_circle = that.circles[key].value.private_circle;
		};

		$scope.deleteCircle = function (circle_id) {
			if(confirm("Delete circle n."+circle_id+"?")){
				var circle={"circle_id":circle_id};
				$http.post(appLocal+'sys/circles/deleteCircle.php',circle).success(function(data) {
					if(data){
						$scope.reloadCircleList();
					}
				});
			}
		};

		$scope.reloadPrivateCircleList=function(){
			Database.getPrivateCircles(true).then(function(circles){
				that.privateCircles=circles;
			});
		};

		$scope.reloadPublicCircleList=function(){
			Database.getPublicCircles(true).then(function(circles){
				that.publicCircles=circles;
			});
		};

		$scope.reloadCircleList=function(){
			this.reloadPrivateCircleList();
			this.reloadPublicCircleList();
		};

		this.setCurrentCircle=function(circle_id){
			this.configureCircleBool=false;
			Database.setCurrentCircle(circle_id).then(function(result){
				if(result){
					$scope.circleChanged();
					$scope.$broadcast("circleChanged");
					Database.setCurrentMusic(0);
				}
			});
		};

		this.configureCircle=function(circle_id){
			this.configureCircleBool=true;
			var i = Database.findKey(that.privateCircles,circle_id);
			$scope.circle_name=this.privateCircles[i].value.circle_name;
			$scope.circle_id=circle_id;

			Database.getUsersLinkedList(true,circle_id).then(function(usersLinked){
				that.usersLinked=usersLinked;
			});
		};

		this.addUserToCircle= function(){
			this.user={
				'circle_id':$scope.circle_id,
				'user_name':$scope.user_to_add
			};
			Database.addUserToCircle(this.user).then(function(result){
				that.result=result;
				$scope.user_to_add='';
				$timeout(function(){
					that.result = null;
					this.configureCircleBool=false;
				}, 2000);
			});	
		};

		$scope.$on("connection", function (event) {
		   	$scope.reloadPrivateCircleList();
			$scope.reloadPublicCircleList();
		});
	}]);

	app.controller('CircleFormController', ['$timeout', '$scope', "Database", function($timeout,$scope,Database){
		var that= this;
		this.result=null;

		this.addCircle= function () {
			this.circle={
				'circle_name':$scope.circle_name,
				'private_circle':$scope.private_circle
			};
			Database.registerCircle(this.circle).then(function(result){
				that.result=result;
				$timeout(function(){that.result = null}, 5000);
				$scope.reloadCircleList();
			});

			$scope.circle_name='';
			$scope.private_circle='';
		};
	}]);

	app.controller('playlistController', ['$timeout','$interval', '$scope', '$http', "Database", function($timeout,$interval,$scope, $http, Database){
		var that = this;
		this.result=null;
		this.currentCircle=null;
		this.currentUser=Database.getUser();
		this.usersLinked=null;
		this.musicLinked=null;
		var youtubeRegexp=new RegExp('((http://)?)(www\.)?((youtube\.com/)|(youtu\.be)|(youtube)).+');
		this.lastReload=new Date();
		this.timeout=30000;

		//this.youtubePlayer=null;
		this.currentVideoId=null;

		var refreshInterval= $interval(function() {
	        var now = new Date(new Date() - that.timeout); //a minute ago
	        if(that.lastReload < now){
	        	$scope.reloadUsersList();
				$scope.reloadMusicList();
	        }
          }, 1000);

		Database.getUserCircle(true).then(function(circle){
			that.currentCircle=circle[0].value;
			Database.getUsersLinked(true,that.currentCircle.circle_id).then(function(usersLinked){
				that.usersLinked=usersLinked;
				that.setUserStatus();
			});
			Database.getMusicLinked(true,that.currentCircle.circle_id).then(function(musicLinked){
				that.musicLinked=musicLinked;
				that.setMusicStatus(that.currentUser.current_music);
				that.playMusic(that.currentUser.current_music);
			});
		});

		this.setMusicStatus=function(current_music){
			if(this.musicLinked.length>0){
				if(current_music==0){
					current_music=this.musicLinked[0].value.music_id;
					Database.setCurrentMusic(current_music);
					this.currentUser.current_music=current_music;
				}
				for(music in this.musicLinked){
					this.musicLinked[music].value.src="imgRepo/"+this.musicLinked[music].value.src+"/"+this.musicLinked[music].value.music_id+".jpg";
				}
				this.changeActiveMusic(current_music);		
			}
		};

		this.changeActiveMusic=function(current_music){
			var i = Database.findKey(that.musicLinked,current_music);
			
			for(music in this.musicLinked){
				this.musicLinked[music].value.status="";
			}

			this.musicLinked[i].value.status="active";
		};

		this.setUserStatus=function(){
			for(user in this.usersLinked){
				if(this.usersLinked[user].value.user_id==this.currentUser.user_id){
					this.usersLinked[user].value.currentStatus="connected";
				}else{
					var date = new Date(this.usersLinked[user].value.last_action);
					var date2= new Date(Date.now()-10*60000);
					if((date.getTime() < date2.getTime()) || this.usersLinked[user].value.status==0){
						this.usersLinked[user].value.currentStatus="disconnected";
					}else{
						this.usersLinked[user].value.currentStatus="connected";
					}
				}
			}
		};

		this.addMusicToCircle= function () {
			this.music={
				'url':$scope.url,
				'circle_id':this.currentCircle.circle_id
			};
			
			if(youtubeRegexp.test(this.music['url'])){
				Database.addMusicToCircle(this.music).then(function(result){
					that.result=result;
					$timeout(function(){that.result = null}, 5000);
					if(result.value){
						$scope.reloadMusicList();
					}
				});
			}else{
				that.result={"value":false,"status":"Lien incorrect"};
				$timeout(function(){that.result = null}, 5000);
			}

			$scope.url='';
		};

		$scope.reloadMusicList= function (){
			Database.getMusicLinked(true,that.currentCircle.circle_id).then(function(musicLinked){
				that.musicLinked=musicLinked;
				that.setMusicStatus(that.currentUser.current_music);
			});
			that.lastReload=new Date();
		};

		$scope.reloadUsersList = function (){
			Database.getUsersLinked(true,that.currentCircle.circle_id).then(function(usersLinked){
				that.usersLinked=usersLinked;
				that.setUserStatus();
			});
			that.lastReload=new Date();
		};

		$scope.reloadCircle = function (){
			Database.getUserCircle(true).then(function(circle){
				that.currentCircle=circle[0].value;
				that.reloadUsersList();
				that.reloadMusicList();
			});
		};

		this.changeMusic=function(music_id){
			if(music_id!=this.currentUser.current_music){
				this.playMusic(music_id);
			}else{
				//replay?
			}
		};

		this.playMusic=function(music_id,player){
			if(music_id!=0 && this.musicLinked.length>=1){
				$scope.reloadUsersList();
				$scope.reloadMusicList();
				
				Database.setCurrentMusic(music_id);
				this.currentUser.current_music=music_id;

				var i = Database.findKey(this.musicLinked, music_id);
				if(player){
					player.loadVideoById(this.musicLinked[i].value.link_id);
				}else{
					this.currentVideoId = this.musicLinked[i].value.link_id;
				}
				this.changeActiveMusic(music_id);
			}
		};

		this.playNextMusic=function(player){
			var i = Database.findKey(this.musicLinked, this.currentUser.current_music);
			if(i>=(this.musicLinked.length-1)){
				this.playMusic(this.musicLinked[0].key,player);
			}else{
				this.playMusic(this.musicLinked[i+1].key,player);
			}
		}


		// youtube.player.ready
		// youtube.player.ended
		// youtube.player.playing
		// youtube.player.paused
		// youtube.player.buffering
		// youtube.player.queued
		// youtube.player.error
		$scope.$on('youtube.player.ready', function ($event, player) {
			player.playVideo(player);
			// console.log(player);
		});
		$scope.$on('youtube.player.ended', function ($event, player) {
			//player.playVideo();
			console.log("ended");
			that.playNextMusic(player);
		});
		$scope.$on('youtube.player.error', function ($event, player) {
			//player.playVideo();
			console.log("error");
			that.playNextMusic(player);
		});

		$scope.$on("circleChanged", function (event) {
		   	$scope.reloadCircle();
		});

	}]);


})();
