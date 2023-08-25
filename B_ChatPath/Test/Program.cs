using Test.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();
builder.Services.AddSignalR();

//Gelecek olan izinlere/isteklere izin vermek
builder.Services.AddCors(options => options.AddDefaultPolicy(policy => policy
                            .AllowCredentials()    
                            .AllowAnyHeader()     
                            .AllowAnyMethod()   
                            .SetIsOriginAllowed(origin => true)
                        ));

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseCors();
app.UseRouting();

app.UseAuthorization();

app.MapRazorPages();

app.MapHub<ChatHub>("/chatpath");


app.Run();
