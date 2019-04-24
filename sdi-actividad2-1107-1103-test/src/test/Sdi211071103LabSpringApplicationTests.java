package test;

import org.junit.After;
import org.junit.AfterClass;
import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.openqa.selenium.By;
import org.openqa.selenium.Keys;
import org.openqa.selenium.NoSuchElementException;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.firefox.FirefoxDriver;

import test.utils.SeleniumUtils;

public class Sdi211071103LabSpringApplicationTests {
	// En Windows (Debe ser la versiÃ³n 65.0.1 y desactivar las actualizacioens
	// automÃ¡ticas)):
	static String PathFirefox64 = "../Firefox/FirefoxPortable.exe";
	static String Geckdriver022 = "geckodriver024win64.exe";
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

	/*
	 * TESTS DE REGISTRO DE USUARIO
	 */

	@Test
	public void test1_registrarse_valido() throws Exception {
		driver.get(URL + "/registrarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("nombre")).click();
		driver.findElement(By.name("nombre")).clear();
		driver.findElement(By.name("nombre")).sendKeys("Miguel");
		driver.findElement(By.name("apellidos")).click();
		driver.findElement(By.name("apellidos")).clear();
		driver.findElement(By.name("apellidos")).sendKeys("Suarez Gonzalez");
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("UO123456@uniovi.es");// Comprobar base de datos, si esta,
																			// borrarlo para que el test no falle
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("ContraseñaContra");
		driver.findElement(By.name("repeatPassword")).click();
		driver.findElement(By.name("repeatPassword")).clear();
		driver.findElement(By.name("repeatPassword")).sendKeys("ContraseñaContra");
		driver.findElement(By.id("registerButton")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("mTienda"));
		driver.findElement(By.id("mPublicaciones"));
		driver.findElement(By.id("mAgregar"));
		driver.findElement(By.id("idPublicaciones"));
		driver.get(URL + "/desconectarse");
	}

	@Test
	public void test2_registrarse_emailRegistrado() throws Exception {
		driver.get(URL + "/registrarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("nombre")).click();
		driver.findElement(By.name("nombre")).clear();
		driver.findElement(By.name("nombre")).sendKeys("Pablo");
		driver.findElement(By.name("apellidos")).click();
		driver.findElement(By.name("apellidos")).clear();
		driver.findElement(By.name("apellidos")).sendKeys("Menendez Fernandez");
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("pablomenendezfernandez@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("ContraseñaContra");
		driver.findElement(By.name("repeatPassword")).click();
		driver.findElement(By.name("repeatPassword")).clear();
		driver.findElement(By.name("repeatPassword")).sendKeys("ContraseñaContra");
		driver.findElement(By.id("registerButton")).click();
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
	}

	@Test
	public void test3_registrarse_emailVacio() throws Exception {
		driver.get(URL + "/registrarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("nombre")).click();
		driver.findElement(By.name("nombre")).clear();
		driver.findElement(By.name("nombre")).sendKeys("Pablo");
		driver.findElement(By.name("apellidos")).click();
		driver.findElement(By.name("apellidos")).clear();
		driver.findElement(By.name("apellidos")).sendKeys("Menendez Fernandez");
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("ContraseñaContra");
		driver.findElement(By.name("repeatPassword")).click();
		driver.findElement(By.name("repeatPassword")).clear();
		driver.findElement(By.name("repeatPassword")).sendKeys("ContraseñaContra");
		driver.findElement(By.id("registerButton")).click();
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
	}

	@Test
	public void test4_registrarse_repetirContraseñaFallido() throws Exception {
		driver.get(URL + "/registrarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("nombre")).click();
		driver.findElement(By.name("nombre")).clear();
		driver.findElement(By.name("nombre")).sendKeys("Pablo");
		driver.findElement(By.name("apellidos")).click();
		driver.findElement(By.name("apellidos")).clear();
		driver.findElement(By.name("apellidos")).sendKeys("Menendez Fernandez");
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("emailEjemplo@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("ContraseñaContra");
		driver.findElement(By.name("repeatPassword")).click();
		driver.findElement(By.name("repeatPassword")).clear();
		driver.findElement(By.name("repeatPassword")).sendKeys("Contraseña");
		driver.findElement(By.id("registerButton")).click();
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
	}

	/*
	 * TESTS DE INICIO DE SESION
	 */

	@Test
	public void test5_identificarse_valido() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("pablomenendezfernandez@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.id("mTienda"));
		driver.findElement(By.id("mPublicaciones"));
		driver.findElement(By.id("mAgregar"));
		driver.findElement(By.id("idPublicaciones"));
		driver.get(URL + "/desconectarse");
	}

	@Test
	public void test6_identificarse_contraseñaErronea() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("pablomenendezfernandez@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("contraseñaErronea");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
	}

	@Test
	public void test7_identificarse_emailVacio() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
	}

	@Test
	public void test8_identificarse_emailInexistente() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("emailInexistente@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
	}

	/*
	 * TESTS DE CIERRE DE SESION
	 */

	@Test
	public void test9_desconectarse_redireccionAlLogin() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("pablomenendezfernandez@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.id("mTienda"));
		driver.findElement(By.id("mPublicaciones"));
		driver.findElement(By.id("mAgregar"));
		driver.findElement(By.id("idPublicaciones"));
		driver.findElement(By.id("mDesconectarse")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("email"));
		driver.findElement(By.name("password"));
		driver.findElement(By.id("logginButton"));
	}

	@Test
	public void test10_desconectarse_comprobarBotonLoggin() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		try {
			driver.findElement(By.id("mDesconectarse"));
		} catch (NoSuchElementException e) {
			return;
		}
		throw new org.openqa.selenium.NoSuchElementException("El elemento no debería aparecer");

	}

	/*
	 * TEST DE LISTADO DE USUARIOS
	 */
	@Test
	public void test10_listarUsuarios() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("admin@email.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("admin");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.linkText("Listar usuarios")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		SeleniumUtils.textoPresentePagina(driver, "Usuarios en el sistema");
		SeleniumUtils.textoNoPresentePagina(driver, "admin@email.com");
		SeleniumUtils.textoPresentePagina(driver, "pablomenendezfernandez@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "ejemplo@uniovi.es");
		SeleniumUtils.textoPresentePagina(driver, "qwerty@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "nachoAcebal@feumierda.com");
		SeleniumUtils.textoPresentePagina(driver, "ruizber@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "dallama@gmail.com");
		SeleniumUtils.textoPresentePagina(driver, "UO123456@uniovi.es");

	}
	
	
	/*
	 * TEST DE BORRADO MÚLTIPLE DE USUARIOS
	 */
	 @Test
	  public void test11_borradoDeUsuarios_primerUsuario() throws Exception {
		driver.get(URL + "/identificarse");
	    driver.findElement(By.name("email")).clear();
	    driver.findElement(By.name("email")).sendKeys("admin@email.com");
	    driver.findElement(By.name("password")).click();
	    driver.findElement(By.name("password")).clear();
	    driver.findElement(By.name("password")).sendKeys("admin");
	    driver.findElement(By.id("logginButton")).click();
	    driver.findElement(By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='true'])[3]/following::input[1]")).click();
	    driver.findElement(By.id("DeleteButton")).click();
	  }
	 
	 @Test
	  public void test12_borradoDeUsuarios_ultimoUsuario() throws Exception {
		 driver.get(URL + "/identificarse");
	    driver.findElement(By.name("email")).click();
	    driver.findElement(By.name("email")).clear();
	    driver.findElement(By.name("email")).sendKeys("admin@email.com");
	    driver.findElement(By.name("password")).click();
	    driver.findElement(By.name("password")).clear();
	    driver.findElement(By.name("password")).sendKeys("admin");
	    driver.findElement(By.name("password")).sendKeys(Keys.ENTER);
	    driver.findElement(By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='true'])[7]/following::input[1]")).click();
	    driver.findElement(By.id("DeleteButton")).click();
	  }
	 
	 @Test
	  public void test13_borradoDeUsuarios_tresUsuarios() throws Exception {
		driver.get(URL + "/identificarse");
	    driver.findElement(By.name("email")).click();
	    driver.findElement(By.name("email")).clear();
	    driver.findElement(By.name("email")).sendKeys("admin@email.com");
	    driver.findElement(By.name("password")).click();
	    driver.findElement(By.name("password")).clear();
	    driver.findElement(By.name("password")).sendKeys("admin");
	    driver.findElement(By.id("logginButton")).click();
	    driver.findElement(By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='true'])[7]/following::input[1]")).click();
	    driver.findElement(By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='true'])[6]/following::input[1]")).click();
	    driver.findElement(By.xpath("(.//*[normalize-space(text()) and normalize-space(.)='true'])[5]/following::input[1]")).click();
	    driver.findElement(By.id("DeleteButton")).click();
	  }

	/*
	 * TEST DE SUBIDA DE OFERTAS
	 */

	@Test
	public void test11_subirOferta_valido() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("pablomenendezfernandez@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.id("mTienda"));
		driver.findElement(By.id("mPublicaciones"));
		while (true) {// Eliminamos todas las ofertas publicadas por el usuario
			try {
				driver.findElement(By.linkText("Eliminar")).click();
				SeleniumUtils.esperarSegundos(driver, 4);
			} catch (NoSuchElementException e) {
				break;
			}
		}
		driver.findElement(By.id("mAgregar")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("nombre")).click();
		driver.findElement(By.id("nombre")).clear();
		driver.findElement(By.id("nombre")).sendKeys("Articulo de prueba");
		driver.findElement(By.id("detalles")).click();
		driver.findElement(By.id("detalles")).clear();
		driver.findElement(By.id("detalles")).sendKeys("Probando la insercion de articulos");
		driver.findElement(By.id("precio")).click();
		driver.findElement(By.id("precio")).clear();
		driver.findElement(By.id("precio")).sendKeys("10.50");
		driver.findElement(By.id("botonAgregar")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("idPublicaciones"));
		driver.findElement(By.tagName("td"));
	}

	@Test
	public void test12_subirOferta_invalido() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.id("mIdentificarse"));
		driver.findElement(By.id("mRegistrarse"));
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("pablomenendezfernandez@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.id("mTienda"));
		driver.findElement(By.id("mPublicaciones"));
		driver.findElement(By.id("mAgregar")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.id("nombre")).click();
		driver.findElement(By.id("nombre")).clear();
		driver.findElement(By.id("detalles")).click();
		driver.findElement(By.id("detalles")).clear();
		driver.findElement(By.id("detalles")).sendKeys("Probando la insercion de articulos");
		driver.findElement(By.id("precio")).click();
		driver.findElement(By.id("precio")).clear();
		driver.findElement(By.id("precio")).sendKeys("10.50");
		driver.findElement(By.id("botonAgregar")).click();
		driver.findElement(By.id("idAgregarOferta"));
	}

	@Test
	public void test16_listadoDeOfertasPropias() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("pablomenendezfernandez@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.id("logginButton")).click();
		driver.findElement(By.linkText("Publicaciones")).click();
		SeleniumUtils.textoPresentePagina(driver, "Mis publicaciones");
		SeleniumUtils.textoPresentePagina(driver, "Nombre");
		SeleniumUtils.textoPresentePagina(driver, "Detalles");
		SeleniumUtils.textoPresentePagina(driver, "Fecha");
		SeleniumUtils.textoPresentePagina(driver, "Precio");
		SeleniumUtils.textoPresentePagina(driver, "Articulo de prueba");
		SeleniumUtils.textoPresentePagina(driver, "Oferta de prueba para destacar");
	}

	/*
	 * TEST DE DAR DE BAJA UNA OFERTA
	 */

	@Test
	public void test17_darDeBajaUnaOferta_primera() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("pablomenendezfernandez@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.name("password")).sendKeys(Keys.ENTER);
		driver.findElement(By.linkText("Publicaciones")).click();
		driver.findElement(By.linkText("Eliminar")).click();
		SeleniumUtils.textoNoPresentePagina(driver, "Artículo de prueba");
		SeleniumUtils.textoPresentePagina(driver, "Oferta de prueba para destacar");
		
	}

	@Test
	public void test17_darDeBajaUnaOferta_ultima() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("qwerty@gmail.com");
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.name("password")).sendKeys(Keys.ENTER);
		driver.findElement(By.linkText("Publicaciones")).click();
		driver.findElement(By.xpath(
				"(.//*[normalize-space(text()) and normalize-space(.)='Pelota de tenis con 7 años de antigüedad, en perfecto estado'])[1]/following::a[1]"))
				.click();
		SeleniumUtils.textoNoPresentePagina(driver, "Pelota de tenis seminueva");
		SeleniumUtils.textoPresentePagina(driver, "Zapatillas Adidas");
		SeleniumUtils.textoPresentePagina(driver, "Acordeón de plástico");

	}

	@Test
	public void test25_listadoOfertasCompradas() throws Exception {
		driver.get(URL + "/identificarse");
		driver.findElement(By.name("email")).click();
		driver.findElement(By.name("email")).clear();
		driver.findElement(By.name("email")).sendKeys("pablomenendezfernandez@gmail.com");
		driver.findElement(By.name("password")).click();
		driver.findElement(By.name("password")).clear();
		driver.findElement(By.name("password")).sendKeys("user123");
		driver.findElement(By.name("password")).sendKeys(Keys.ENTER);
		SeleniumUtils.esperarSegundos(driver, 5);
		driver.findElement(By.linkText("Compras")).click();
		SeleniumUtils.esperarSegundos(driver, 5);
		SeleniumUtils.textoPresentePagina(driver, "Mis compras");
		SeleniumUtils.textoPresentePagina(driver, "Nombre");
		SeleniumUtils.textoPresentePagina(driver, "Detalles");
		SeleniumUtils.textoPresentePagina(driver, "Precio");
		SeleniumUtils.textoPresentePagina(driver, "Vendedor");
		SeleniumUtils.textoPresentePagina(driver, "Disco ACDC");
		SeleniumUtils.textoPresentePagina(driver, "Samsung Galaxy 100XPlus");
	}

}
