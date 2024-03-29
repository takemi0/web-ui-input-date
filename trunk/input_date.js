/**
 * 日付入力コンポーネント
 */
var component_input_date = {
	/**
	 * IF変数
	 */
	props : {
		value : [ String, Date ],
		/**
		 * HTMLのINPUT名
		 */
		input_name : String,

		/**
		 * カレンダーボタンの表示フラグ: ture or false
		*/
		ButtonCalendar : String,

		/**
		 * クリアボタン表示フラグ: ture or false
		*/
		ButtonClear : String,

		/**
		  * カレンダーボタンのアイコン画像を指定
		 */
		ButtonCalendarIcon : String,

		/**
		  * 今日ボタンの表示フラグ:true or false
		  */
		ButtonToday : String,

		/**
		 * 曜日の表示フラグ:true or false
		 */
		isWeek :String,

		/**
		 * 選択範囲の最小日付
		 */
		min : [ String, Date ],

		/**
		 * 選択範囲の最大日付
		 */
		 max : [ String, Date ],

		/**
		 * 確認表示用
		 */
		confirm : String,
	},
	/**
	 * 内部変数
	 */
	data : function(){
		return {
			__name : "input_date",
			visibleConfirm : false,
			visibleButtonToday : false,
			visibleButtonCalendar : false,
			visibleButtonClear : false,
			visibleWeek : false,
			date : { year : 0 , month : 0, date : 0},
			week : 0,
			today : { year : 0 , month : 0, date : 0},
			cal_val : null,
			/**
			 * 年のセレクト要素
			 */
			select_year : [],
			/**
			 * 月のセレクト要素
			 */
			select_month: [],
			/**
			 * 日のセレクト要素
			 */
			select_date : [],
			/**
			 * 曜日の配列
			 */
			list_week : ['日','月','火','水','木','金','土'],
			input_year_name : "input_date_year",
			input_month_name : "input_date_month",
			input_date_name: "input_date_date",
			input_calendar_name: "input_date_calendar",
			minDate : null,
			maxDate : null,
			on_change :null,
		};
	},
	/**
	 * テンプレート
	 */
	template :
	 '<span>' +
	 '<span v-if="visibleConfirm">{{cal_val}}</span>' + 
	 '<span v-else>' + 
	 '<input type="hidden" v-bind:name="input_name" v-model="cal_val"/>' +
	 '<select v-bind:name="input_year_name" v-model="date.year" style="text-align:right;"><option v-for="node in select_year" v-bind:value="node.value">{{node.text}}</option></select> 年 ' +
	 '<select v-bind:name="input_month_name" v-model="date.month" style="text-align:right;"><option v-for="node in select_month" v-bind:value="node.value">{{node.text}}</option></select> 月 ' +
	 '<select v-bind:name="input_date_name" v-model="date.date" style="text-align:right;"><option v-for="node in select_date" v-bind:value="node.value">{{node.text}}</option></select> 日 ' +
	 '<span v-if="visibleWeek">({{this.week}})&nbsp;</span>' +
	 '<button v-if="visibleButtonToday" type="button" v-on:click="setToday">今日</button>&nbsp;' +
	 '<span v-if="visibleButtonCalendar" ><input v-on:change="setCalDate" class="datepicker" v-bind:id="input_calendar_name" v-bind:name="input_calendar_name" style="width:0px;border:none;" disabled></span>' +
	 '<span v-if="visibleButtonClear" >&nbsp;<button type="button" v-on:click="clearDate" >クリア</button></span>' +
	 '</span>'+
	 '</span>',
	methods : {
		/**
		 * 
		 */
		setToday : function(){
			this.date.year = this.today.year;
			this.date.month = this.today.month;
			this.date.date = this.today.date;
		},
		/**
		 * クリア
		 */
		clearDate : function() {
			this.date.year = "";
			this.date.month = "";
			this.date.date = "";
		},
		setName : function( value ){
			this.__name = value;
			this.input_year_name = this.__name + '_year';
			this.input_month_name = this.__name + '_month';
			this.input_date_name = this.__name + '_date';
			this.input_calendar_name = this.__name + '_calendar';
			return value;
		},
		setCalDate : function(){
			console.log('change');
			let tmp = $('input[id='+this.input_calendar_name+']').val();
			if( tmp == "//" ) {
				this.clearDate();
				return;
			}
			tmp = tmp.split('/');
			this.date.year = tmp[0];
			this.date.month = tmp[1];
			this.date.date = tmp[2];
		},
		makeYearItem : function( year ) {
			if( year == "" || !year ) {
				year = (new Date()).getFullYear();
			}
			let first = year - 100;
			let last = year + 10;
			if( this.minDate ) first = this.minDate.getFullYear();
			if( this.maxDate ) last = this.maxDate.getFullYear();

			this.select_year = [];
			this.select_year.push( { text : "", value : "" } );
			for( let n = first; n <= last; n ++ ) {
				this.select_year.push( { text : n, value : n } );
			}

			if( this.date.year < first ) this.date.year = first;
			if( this.date.year > last ) this.date.year = last;
		},
		makeMonthItem : function( year, month ){
			let first = 1;
			let last = 12;

			//最小月の設定
			if( this.minDate && year == this.minDate.getFullYear() ) {
				first = this.minDate.getMonth() + 1;
			}

			//最大月の設定
			if( this.maxDate && year == this.maxDate.getFullYear() ) {
				last = this.maxDate.getMonth() + 1;
			}

			this.select_month = [];
			this.select_month.push( { text : "", value : "" } );
			for( let n = first; n <= last; n ++ ) this.select_month.push( { text : n, value : n } );

			if( this.date.month < first ) this.date.month = first;
			if( this.date.month > last ) this.date.month = last;
		},
		makeDateItem : function( year, month ){
			let first = 1;
			let last = 31;

			//最小月の設定
			if( this.minDate && ( year == this.minDate.getFullYear() && month == this.minDate.getMonth() + 1 ) ) {
				fist = this.minDate.getDate();
			}

			//最大月の設定
			if( this.maxDate && ( year == this.maxDate.getFullYear() && month == this.maxDate.getMonth() + 1 ) ) {
				last = this.maxDate.getDate();
			}

			//月末日を確認
			tmp = new Date( year, month, 0 );
			if( last > tmp.getDate() ) last = tmp.getDate();

			this.select_date = [];
			this.select_date.push( { text : "", value : "" } );
			for( let n = first; n <= last; n ++ ) this.select_date.push( { text : n, value : n } );
			if( this.date.date == "" ) return;
			//選択日付が年月の末日よりも大きくなる場合は、年月の末日に揃える
			if( this.date.date > last ) this.date.date = last;
			if( this.date.date < first ) this.date.date = first;
		}
	},
	watch : {
		input_name : function(value){
			this.setName(value);
		},
		'date.year' : function( val ){
			if( val == "" ) {
				this.cal_val =  "";
				this.makeDateItem( this.today.year, this.today.month );
				return;
			}
			this.makeDateItem( val, this.date.month );
			if( this.date.month && this.date.date ) this.cal_val =  val + "/" + this.date.month + "/" + this.date.date;
			else this.cal_val = "";
			$('input[id='+this.input_calendar_name+']').val(this.cal_val);
			this.week = this.list_week[ (new Date( val, this.date.month, this.date.date)).getDay() ];
		},
		'date.month' : function( val ){
			if( val == "" ) {
				this.cal_val =  "";
				this.makeDateItem( this.today.year, this.today.month );
				return;
			}
			this.makeDateItem( this.date.year, val );
			if( this.date.year && this.date.date ) this.cal_val =  this.date.year + "/" + val + "/" + this.date.date;
			else this.cal_val = "";
			$('input[id='+this.input_calendar_name+']').val(this.cal_val);
			this.week = this.list_week[ (new Date( this.date.year, val, this.date.date)).getDay() ];
		},
		'date.date' : function( val ){
			if( val == "" ) {
				this.cal_val =  "";
				return;
			}
			if( this.date.month && this.date.year ) this.cal_val =  this.date.year + "/" + this.date.month + "/" + val;
			else this.cal_val = "";
			$('input[id='+this.input_calendar_name+']').val(this.cal_val);
			this.week = this.list_week[ (new Date( this.date.year, this.date.month, val)).getDay() ];
		},
		ButtonCalender : function( val ){
			if( val == "true" || val == true ){ 
				this.visibleButtonCalendar = true;
			} else {
				this.visibleButtonCalendar = false;
			}
		}, 
		ButtonToday : function( val ){
			if( val == "true" || val == true ){ 
				this.visibleButtonToday = val;
			} else {
				this.visibleButtonToday = false;
			}
		},

		Week :function( val ){
			if( val == "true" || val == true ) {
				this.visibleWeek = true;
			} else {
				this.visibleWeek = false;
			}
		},
		cal_val : function( val ){
			this.$emit('input', val );
			if( this.on_change ){
				this.on_change( val );
			}
		},
		minDate : function( val ){
			this.makeYearItem( this.date.year );
			this.makeMonthItem( this.date.year, this.date.month );
			$('input[id='+this.input_calendar_name+']').datepicker('option', 'minDate', new Date(val) );
		},
		min : function( val ) {
			this.minDate = new Date(val);
			this.makeYearItem( this.date.year );
			this.makeMonthItem( this.date.year, this.date.month );
			$('input[id='+this.input_calendar_name+']').datepicker('option', 'minDate', new Date(val) );
		},
		maxDate : function( val ){
			this.makeYearItem( this.date.year );
			this.makeMonthItem( this.date.year, this.date.month );
			$('input[id='+this.input_calendar_name+']').datepicker('option', 'maxDate', new Date(val) );
		},
		max : function( val ) {
			this.maxDate = new Date(val);
			this.makeYearItem( this.date.year );
			this.makeMonthItem( this.date.year, this.date.month );
			$('input[id='+this.input_calendar_name+']').datepicker('option', 'maxDate', new Date(val) );
		}
	},
	created : function(){
		let today = new Date();

		this.today.year = today.getFullYear();
		this.today.month = today.getMonth() + 1;
		this.today.date = today.getDate();

		if( this.min ) {
			this.minDate = new Date( this.min );
		}
		if( this.max ) {
			this.maxDate = new Date( this.max );
		}

		if( !this.value ) {
			this.setToday();
		} else {
			let tmp = null;
			if( typeof this.value == 'object' )  {
				tmp = this.value;
			}
			else tmp = new Date(this.value);

			this.date.year = tmp.getFullYear();
			this.date.month = tmp.getMonth() + 1;
			this.date.date = tmp.getDate();
		}

		this.makeYearItem( this.date.year );
		this.makeMonthItem( this.date.year, this.date.month );
		this.makeDateItem( this.date.year, this.date.month );

		if( this.confirm && this.confirm == "true" ) {
			this.visibleConfirm = true;
			this.cal_val = this.value;
		}

		this.setName( this.input_name );
		if( this.ButtonCalendar && this.ButtonCalendar == "true" ) this.visibleButtonCalendar = true;
		if( this.ButtonToday && this.ButtonToday == "true") this.visibleButtonToday = true;
		if( this.ButtonClear && this.ButtonClear == "true") this.visibleButtonClear = true;
		if( this.isWeek && this.isWeek == "true") this.visibleWeek = true;

		if( this.visibleButtonClear && !this.value ) {
			this.clearDate();
		}
	},
	mounted : function() {
		//datepickerを有効にする
		let trg = $('input[id='+this.input_calendar_name+']');
		let me = this;
		trg.datepicker({
			changeYear : true,
			changeMonth : true,
			showOn : "button",
		});
		//最小日付の設定
		if( this.minDate ){
			trg.datepicker('option', 'minDate', this.minDate );
		}
		//最大日付の設定
		if( this.maxDate ){
			trg.datepicker('option', 'maxDate', this.maxDate );
		}
		//カレンダーアイコンの設定
		if( this.ButtonCalendarIcon ){
			trg.datepicker('option', 'buttonImage', this.ButtonCalendarIcon );
			trg.datepicker('option', 'buttonImageOnly', true );
		}
		if( this.ButtonToday ){
			trg.datepicker('option', 'showButtonPanel', true );
			$.datepicker._gotoToday = function(id){
				let target = $(id);
				let date = new Date();
				target.val( date.getFullYear() + '/' + (date.getMonth()+1) +'/' + date.getDate() );
				me.date.year = date.getFullYear();
				me.date.month = date.getMonth() + 1;
				me.date.date = date.getDate();
				this._hideDatepicker();
			}
		}
		trg.change( function(event){
			let tmp = $(event.currentTarget).val();
			if( tmp == "//" ) {
				me.date.year= "";
				me.date.month= "";
				me.date.date= "";
				return;
			}
			tmp = tmp.split('/');
			me.date.year = tmp[0] * 1;
			me.date.month = tmp[1] *1;
			me.date.date = tmp[2] * 1;
		});
	}
};