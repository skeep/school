'use strict';

angular.module('schoolApp')
  .controller('MainCtrl', function ($scope) {

    function initData(){
      var teacherClassLimit = 26;
      var teachers = ['R Dey', 'S Das', 'S Ghosh', 'M Pal', 'D Das', 'S Chatterjee', 'TC Chakraborty', 'P Chakarborty', 'S Sengupta', 'S Das(2)', 'A Mondal', 'S Sutradhar', 'S Pal'];
      var classes = ['II - A', 'II - B1', 'II - B2', 'III - A', 'III - B1', 'III - B2', 'IV - A', 'IV - B', 'V - B'];
      var subjects = [
        {name: 'Bengali I', count: 5},
        {name: 'Bengali II', count: 3},
        {name: 'English I', count: 5},
        {name: 'English II', count: 3},
        {name: 'Maths', count: 6},
        {name: 'EVS', count: 4},
        {name: 'History', count: 2},
        {name: 'Science', count: 2},
        {name: 'Geography', count: 2},
        {name: 'GK', count: 2},
        {name: 'Computer', count: 2},
        {name: 'PT', count: 1},
        {name: 'Hindi', count: 2},
        {name: 'Drawing', count: 1}
      ];
      var teachers = _.map(teachers, function(teacher){
        return {
          name : teacher,
          classTaking: 0
        }
      });

      var subjects = _.map(subjects, function(subject){
        return {
          name : subject.name,
          classes : _.map(classes, function(claz){
            return {
              name : claz,
              count : getClassCount(subject, claz)
            }
          })
        }
      });

      function getClassCount(subject, claz){
        var isBengaliMedium = claz.indexOf("B") != -1;
        var isClassFourOrFive = claz.indexOf("V") != -1;

        if(subject.name === 'EVS' && isBengaliMedium){
          return 0;
        } else if((subject.name === 'History' || subject.name === 'Geography') && !isBengaliMedium) {
          return 0;
        } else if(isClassFourOrFive && (subject.name === 'Bengali I' || subject.name === 'English I')){
          return 4;
        } else {
          return subject.count;
        }
      }

      var classes = _.map(classes, function(clas){
        return {
          name : clas,
          teacher: {},
          subject: {}
        }
      });


      var weekDays = [
        {name : 'Monday', periodCount : 6},
        {name : 'Tuesday', periodCount : 6},
        {name : 'Wednesday', periodCount : 6},
        {name : 'Thursday', periodCount : 6},
        {name : 'Friday', periodCount : 6},
        {name : 'Saturday', periodCount : 5}
      ];

      var week = _.map(weekDays, function(day){
        return {
          name: day.name,
          periods : _.times(day.periodCount, function(i){
            return {
              index : i,
              classes : angular.copy(classes)
            };
          })
        }
      });


      $scope.data.teachers = teachers;
      $scope.data.classes = classes;
      $scope.data.subjects = subjects;
      $scope.data.week = week;
      $scope.data.teacherClassLimit = teacherClassLimit;
      $scope.data.selected = {
        teacher : {},
        subject: {}
      };

      saveToLocalStorage($scope.data);
    }

    $scope.initView = function(){
      $scope.data = fetchFromLs();
      if(_.isEmpty($scope.data)){
        initData();
      }
//      initData();
    }

    $scope.assignPeriod = function(claz, period){
      if(!_.isEmpty($scope.data.selected.teacher) && !_.isEmpty($scope.data.selected.subject)){
        var existingClass = _.filter(period.classes,function(c){
          return c.teacher.name === $scope.data.selected.teacher.name;
        });
        if(existingClass.length){
          $scope.deletePeriod(existingClass[0]);
          existingClass[0].teacher = {};
          existingClass[0].subject = {};
        }
        claz.teacher = $scope.data.selected.teacher;
        claz.subject = $scope.data.selected.subject;
        claz.teacher.classTaking++;
        _.filter(claz.subject.classes, function(c){
          return c.name === claz.name
        })[0].count--;
        saveToLocalStorage($scope.data);
      }
    };

    $scope.deletePeriod = function(claz){
      _.filter($scope.data.teachers, function(t){
        return t.name === claz.teacher.name;
      })[0].classTaking--;

      (_.filter((_.filter($scope.data.subjects, function(s){
        return s.name === claz.subject.name;
      })[0].classes), function(clazz){
        return clazz.name === claz.name;
      })[0].count)++;
      claz.subject = {};
      claz.teacher = {};
      saveToLocalStorage($scope.data);
    };


    function saveToLocalStorage(data){
      localStorage['routineData'] = JSON.stringify(data);
    }

    function fetchFromLs(){
      if(localStorage['routineData']){
        return JSON.parse(localStorage['routineData']);
      } else {
        return {};
      }
    }
  });
