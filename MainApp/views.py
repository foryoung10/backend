from django.shortcuts import render


def index(request):
    # Request the context of the request.
    # The context contains information such as the client's machine details, for example.
    context = {}
	# Construct a dictionary to pass to the template engine as its context.
    # Note the key boldmessage is the same as {{ boldmessage }} in the template!
    context_dict = {'boldmessage': "I am bold font from the context"}

    return render(request, 'MainApp/index.html', context)

	
	