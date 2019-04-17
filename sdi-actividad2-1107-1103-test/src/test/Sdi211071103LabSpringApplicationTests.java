package test;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import test.utils.SeleniumUtils;

public class Sdi211071103LabSpringApplicationTests {
	// En Windows (Debe ser la versiÃ³n 65.0.1 y desactivar las actualizacioens
	// automÃ¡ticas)):
	static String PathFirefox64 = "C:\\Program Files (x86)\\Mozilla Firefox\\firefox.exe";
	static String Geckdriver022 = "C:\\Users\\Pablo\\Desktop\\SDI\\PL-SDI-SesiÃ³n5-material\\geckodriver024win64.exe";
	// ComÃºn a Windows y a MACOSX
	static WebDriver driver = getDriver(PathFirefox64, Geckdriver022);
	static String URL = "http://localhost:8081";
	

	public static WebDriver getDriver(String PathFirefox, String Geckdriver) {
		System.setProperty("webdriver.firefox.bin", PathFirefox);
		System.setProperty("webdriver.gecko.driver", Geckdriver);
		WebDriver driver = new FirefoxDriver();
		return driver;
	}

	@Before
	public void setUp() throws Exception {
		driver.navigate().to(URL);
	}

	@After
	public void tearDown() throws Exception {
		driver.manage().deleteAllCookies();
	}

	@BeforeClass
	static public void begin() {
	}

	// Al finalizar la Ãºltima prueba
	@AfterClass
	static public void end() {
		// Cerramos el navegador al finalizar las pruebas
		driver.quit();
	}
	
	@Test
	public void Adminlogin(String email, String password) throws Exception {
		driver.get("http://localhost:8081/identificarse");
	    driver.findElement(By.name("email")).click();
	    driver.findElement(By.name("email")).clear();
	    driver.findElement(By.name("email")).sendKeys(email);
	    driver.findElement(By.name("password")).click();
	    driver.findElement(By.name("password")).clear();
	    driver.findElement(By.name("password")).sendKeys(password);
	    driver.findElement(By.name("password")).sendKeys(Keys.ENTER);
	}


	@Test
	public void prueba1() throws Exception {
		driver.get(URL + "/signup");
		driver.findElement(By.name("name")).click();
		driver.findElement(By.name("name")).clear();
		driver.findElement(By.name("name")).sendKeys("Juan Carlos");
		driver.findElement(By.name("lastName")).click();
		driver.findElement(By.name("lastName")).clear();
		driver.findElement(By.name("lastName")).sendKeys("Ã�lvarez GarcÃ­a");
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("UO123456@uniovi.es");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("ContraseÃ±aContra");
		driver.findElement(By.name("passwordConfirm")).click();
		driver.findElement(By.name("passwordConfirm")).clear();
		driver.findElement(By.name("passwordConfirm"))
				.sendKeys("ContraseÃ±aContra");
		driver.findElement(By.id("registerButton")).click();
	}
	
	@Test
	public void prueba10() throws Exception {
		Adminlogin("admin@email.com", "admin");
		driver.get("http://localhost:8081/publicaciones");
		driver.findElement(By.linkText("Listar usuarios")).click();
		SeleniumUtils.textoPresentePagina(driver, "Usuarios en el sistema");
		SeleniumUtils.textoNoPresentePagina(driver, "admin@email.com");
		
	}
	
}
