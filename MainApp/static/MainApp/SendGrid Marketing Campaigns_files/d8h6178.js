try { 
	(function() {

  function identify_ (id, traits) {
    // console.log('identify_ - ', arguments, mapTraits(flatten(traits)));
    if (id) window.webengage.user.login(id);

    if (traits) window.webengage.user.setAttribute(mapTraits(flatten(traits)));
  }

  function track_ (event, properties) {
    // console.log('track_ - ', arguments);
    window.webengage.track(event, flatten(properties));
  }

  function page_ (category, name, properties) {
    // console.log('page_ - ', arguments);
    properties = flatten(properties);
    window.webengage.screen(name, properties);
    window.webengage.reload();
  }

  /**
   * Map traits to their WebEngage attributes.
   *
   * http://docs.webengage.com/sdks/web/user/readme.html#predefined-attribute-keys
   *
   * @param {Object} traits
   * @return {Object} mapped
   * @api private
   */

  function mapTraits(traits) {
    var asString = Object.prototype.toString;

    var aliases = {
      name: 'we_first_name',
      firstName: 'we_first_name',
      lastName: 'we_last_name',
      email: 'we_email',
      gender: 'we_gender',
      birthday: 'we_birth_date',
      phone: 'we_phone',
      company: 'we_company'
    };

    var mapped = {};
    for (var k in traits) {
      if (aliases.hasOwnProperty(k)) {
        mapped[aliases[k]] = traits[k];
      } else {
        mapped[k] = traits[k];
      }
    }

    if (asString.call(mapped.we_birth_date) === '[object Date]') {
      var date = mapped.we_birth_date;

      mapped.we_birth_date = date.getUTCFullYear()
        + '-' + pad(date.getUTCMonth() + 1)
        + '-' + pad(date.getUTCDate());
    }

    return mapped;
  }

  /**
   * Pad single digit numbers with a leading 0.
   *
   * @param {number} number
   * @return {number}
   * @api private
   */

  function pad(number) {
    return number < 10 ? '0' + number : number;
  }

  /**
   * Flatten nested objects and arrays
   *
   * @param {Object} obj
   * @return {Object} obj
   * @api public
   */

  function flatten(target) {
    var asString = Object.prototype.toString;
    var delimiter = '.';
    var output = {};

    function step(object, prev) {
      for (var key in object) {
        if (object.hasOwnProperty(key)) {
          var value = object[key];
          var type = asString.call(value);

          if (value == null) continue;

          var newKey = prev
            ? prev + delimiter + key
            : key;

          // leave booleans, numbers, strings and dates as is
          if (type === '[object Boolean]' || type === '[object Number]' || type === '[object String]' || type === '[object Date]') {
            output[newKey] = value;
          } else if (type !== '[object Object]' && type !== '[object Array]') {
          // convert non objects/arrays to strings
            output[newKey] = value.toString();
          } else {
            step(value, newKey);
          }
        }
      }
    }

    step(target);

    return output;
  }


  analytics.on('track', track_);

  analytics.on('page', page_);

  analytics.on('identify', identify_);

})();
 } catch(e) { 
 	if (e instanceof Error) { 
		var data = e.stack || e.description;
		data = (data.length > 900 ? data.substring(0, 900) : data);
	 	webengage.eLog(null, 'error', data, 'cwc-error','cwc', 'd8h6178');
	 }
 }
