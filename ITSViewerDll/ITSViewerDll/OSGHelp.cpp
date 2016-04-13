// MFC_OSG.cpp : implementation of the cOSG class
//
#include "OSGHelp.h"


cOSG::cOSG(HWND hWnd) :
	m_hWnd(hWnd)
{
}

cOSG::~cOSG()
{
	mViewer->setDone(true);
	Sleep(1000);
	mViewer->stopThreading();

	//delete mViewer;
}

void cOSG::InitOSG(std::string modelname)
{
	// Store the name of the model to load
	m_ModelName = modelname;
	// Create the viewer for this window
	mViewer = new osgViewer::Viewer();

	// Add a Stats Handler to the viewer
	mViewer->addEventHandler(new osgViewer::StatsHandler);
	// Init different parts of OSG
	InitManipulators();
	InitSceneGraph();
	InitCameraConfig();

	//InitSkyDome();
}

void cOSG::InitManipulators(void)
{
	// Create a Manipulator Switcher
	//keyswitchManipulator = new osgGA::KeySwitchMatrixManipulator;

	//// Add our trackball manipulator to the switcher
	//keyswitchManipulator->addMatrixManipulator('1', "Trackball", new osgGA::TrackballManipulator());

	//// Init the switcher to the first manipulator (in this case the only manipulator)
	//keyswitchManipulator->selectMatrixManipulator(0);  // Zero based index Value

	travelManipulator = new TravelManipulator(mViewer);
	travelManipulator->setWander(true);
}


void cOSG::InitSceneGraph(void)
{

	// Init the main Root Node/Group
	mRoot = new osg::Group;

	osg::ref_ptr<osg::MatrixTransform> transform = new osg::MatrixTransform();

	transform->setMatrix(osg::Matrixf::translate(osg::Vec3(0.0f, 0.0f, 0.0f)));

	transform->addChild(osgDB::readNodeFile(m_ModelName));
	transform->setName("node");
	// Optimize the model
	osgUtil::Optimizer optimizer;
	optimizer.optimize(transform.get());
	optimizer.reset();

	// Add the model to the scene
	mRoot->addChild(transform.get());

}

void cOSG::AddShip(void)
{

	// Init the main Root Node/Group

	osg::ref_ptr<osg::MatrixTransform> transform = new osg::MatrixTransform();

	transform->setMatrix(osg::Matrixf::translate(osg::Vec3(0.0f, 0.0f, 0.0f)));

	transform->addChild(osgDB::readNodeFile("ferry02.ive"));
	transform->setName("ship_1");
	// Optimize the model
	osgUtil::Optimizer optimizer;
	optimizer.optimize(transform.get());
	optimizer.reset();

	// Add the model to the scene
	mRoot->addChild(transform.get());

}

void cOSG::InitCameraConfig(void)
{
	// Local Variable to hold window size data
	RECT rect;

	// Get the current window size
	::GetWindowRect(m_hWnd, &rect);

	// Init the GraphicsContext Traits
	osg::ref_ptr<osg::GraphicsContext::Traits> traits = new osg::GraphicsContext::Traits;

	// Init the Windata Variable that holds the handle for the Window to display OSG in.
	osg::ref_ptr<osg::Referenced> windata = new osgViewer::GraphicsWindowWin32::WindowData(m_hWnd);

	// Setup the traits parameters
	traits->x = 0;
	traits->y = 0;
	traits->width = rect.right - rect.left;
	traits->height = rect.bottom - rect.top;
	traits->windowDecoration = false;
	traits->doubleBuffer = true;
	traits->sharedContext = 0;
	traits->setInheritedWindowPixelFormat = true;
	traits->inheritedWindowData = windata;

	// Create the Graphics Context
	osg::GraphicsContext* gc = osg::GraphicsContext::createGraphicsContext(traits.get());

	// Init Master Camera for this View
	osg::ref_ptr<osg::Camera> camera = mViewer->getCamera();

	// Assign Graphics Context to the Camera
	camera->setGraphicsContext(gc);

	// Set the viewport for the Camera
	camera->setViewport(new osg::Viewport(traits->x, traits->y, traits->width, traits->height));

	// Set projection matrix and camera attribtues
	camera->setClearMask(GL_DEPTH_BUFFER_BIT | GL_COLOR_BUFFER_BIT);
	camera->setClearColor(osg::Vec4f(0.2f, 0.2f, 0.4f, 1.0f));
	camera->setProjectionMatrixAsPerspective(
		30.0f, static_cast<double>(traits->width) / static_cast<double>(traits->height), 1.0, 20000.0);
	//**设置视点的远近分割，即视锥体
	camera->setComputeNearFarMode(osg::CullSettings::DO_NOT_COMPUTE_NEAR_FAR);
	camera->setCullingMode(camera->getCullingMode() & ~osg::CullStack::SMALL_FEATURE_CULLING);
	camera->setAllowEventFocus(true);
	camera->setName("master");

	// Add the Camera to the Viewer
	//mViewer->addSlave(camera.get());
	mViewer->setCamera(camera.get());

	// Add the Camera Manipulator to the Viewer
	//mViewer->setCameraManipulator(keyswitchManipulator.get());
	mViewer->setCameraManipulator(travelManipulator.get());

	AddOcean();
	AddShip();

	//mViewer->setLightingMode(osg::View::NO_LIGHT);
	osg::ref_ptr<osg::StateSet> globalStateset = mViewer->getCamera()->getStateSet();
	osg::ref_ptr<osg::LightModel> lightModel = new osg::LightModel;
	lightModel->setAmbientIntensity(osg::Vec4(1.0, 1.0, 1.0, 0));
	globalStateset->setAttributeAndModes(lightModel, osg::StateAttribute::ON);
	mRoot->getOrCreateStateSet()->setMode(GL_LIGHTING, osg::StateAttribute::ON);


	// Set the Scene Data
	mViewer->setSceneData(mRoot.get());

	controlHandler = new ControlHandler(mViewer);
	mViewer->addEventHandler(controlHandler);

	// Realize the Viewer
	mViewer->realize();

	// Correct aspect ratio
	/*double fovy,aspectRatio,z1,z2;
	mViewer->getCamera()->getProjectionMatrixAsPerspective(fovy,aspectRatio,z1,z2);
	aspectRatio=double(traits->width)/double(traits->height);
	mViewer->getCamera()->setProjectionMatrixAsPerspective(fovy,aspectRatio,z1,z2);*/
}

//读取天空盒的纹理
osg::ref_ptr<osg::TextureCubeMap> loadCubeMapTexture()
{
	osg::ref_ptr<osg::TextureCubeMap> cubemap = new osg::TextureCubeMap;
	cubemap->setInternalFormat(GL_RGBA);
	cubemap->setFilter(osg::Texture::MIN_FILTER, osg::Texture::LINEAR_MIPMAP_LINEAR);
	cubemap->setFilter(osg::Texture::MAG_FILTER, osg::Texture::LINEAR);
	cubemap->setWrap(osg::Texture::WRAP_S, osg::Texture::CLAMP_TO_EDGE);
	cubemap->setWrap(osg::Texture::WRAP_T, osg::Texture::CLAMP_TO_EDGE);
	//cubemap->setWrap(osg::Texture::WRAP_R, osg::Texture::CLAMP_TO_EDGE);
	//cubemap->setImage(osg::TextureCubeMap::NEGATIVE_X, osgDB::readImageFile("resources/textures/sky_night/west.png"));
	//cubemap->setImage(osg::TextureCubeMap::POSITIVE_X, osgDB::readImageFile("resources/textures/sky_night/east.png"));
	//cubemap->setImage(osg::TextureCubeMap::NEGATIVE_Y, osgDB::readImageFile("resources/textures/sky_night/up.png"));
	//cubemap->setImage(osg::TextureCubeMap::POSITIVE_Y, osgDB::readImageFile("resources/textures/sky_night/down.png"));
	//cubemap->setImage(osg::TextureCubeMap::NEGATIVE_Z, osgDB::readImageFile("resources/textures/sky_night/south.png"));
	//cubemap->setImage(osg::TextureCubeMap::POSITIVE_Z, osgDB::readImageFile("resources/textures/sky_night/north.png"));
	cubemap->setImage(osg::TextureCubeMap::NEGATIVE_X, osgDB::readImageFile("resources\\textures\\sky_fair_cloudy\\west.png"));
	cubemap->setImage(osg::TextureCubeMap::POSITIVE_X, osgDB::readImageFile("resources\\textures\\sky_fair_cloudy\\east.png"));
	cubemap->setImage(osg::TextureCubeMap::NEGATIVE_Y, osgDB::readImageFile("resources\\textures\\sky_fair_cloudy\\up.png"));
	cubemap->setImage(osg::TextureCubeMap::POSITIVE_Y, osgDB::readImageFile("resources\\textures\\sky_fair_cloudy\\down.png"));
	cubemap->setImage(osg::TextureCubeMap::NEGATIVE_Z, osgDB::readImageFile("resources\\textures\\sky_fair_cloudy\\south.png"));
	cubemap->setImage(osg::TextureCubeMap::POSITIVE_Z, osgDB::readImageFile("resources\\textures\\sky_fair_cloudy\\north.png"));
	//cubemap->setImage(osg::TextureCubeMap::NEGATIVE_X, osgDB::readImageFile("west.rgb"));
	//cubemap->setImage(osg::TextureCubeMap::POSITIVE_X, osgDB::readImageFile("east.rgb"));
	//cubemap->setImage(osg::TextureCubeMap::NEGATIVE_Y, osgDB::readImageFile("up.rgb"));
	//cubemap->setImage(osg::TextureCubeMap::POSITIVE_Y, osgDB::readImageFile("down.rgb"));
	//cubemap->setImage(osg::TextureCubeMap::NEGATIVE_Z, osgDB::readImageFile("south.rgb"));
	//cubemap->setImage(osg::TextureCubeMap::POSITIVE_Z, osgDB::readImageFile("north.rgb"));
	return cubemap;
}

void cOSG::InitSkyDome()
{
	//**天空盒
	osg::ref_ptr<osg::TextureCubeMap> cubemap = loadCubeMapTexture();
	osg::ref_ptr<SkyDome> skydome = new SkyDome(19000.0f, 32, 32, cubemap.get(), mViewer);

	//**申请transform放置天空盒
	osg::ref_ptr<osg::MatrixTransform> transform = new osg::MatrixTransform;
	transform->setDataVariance(osg::Object::DYNAMIC);
	//	transform->setMatrix(osg::Matrixf::translate(osg::Vec3d(tm->getPosition().x(),tm->getPosition().y(),-2000.0f)));
	//**使天空盒跟随相机移动
	transform->setCullCallback(new CameraTrackCallback);
	//**加入天空盒
	//skydome->setNodeMask(oceanscene->getReflectedSceneMask() | oceanscene->getNormalSceneMask());

	//skydome->getStateSet()->setUpdateCallback(new UniformCallback(mViewer));
	mOceanscene->addChild(skydome);
	//mRoot->addChild(transform.get());
}

void cOSG::PreFrameUpdate()
{
	// Due any preframe updates in this routine
}

void cOSG::PostFrameUpdate()
{
	// Due any postframe updates in this routine
}

osg::Vec4f intColor(unsigned int r, unsigned int g, unsigned int b, unsigned int a = 255)
{
	float div = 1.f / 255.f;
	return osg::Vec4f(div*(float)r, div*(float)g, div*float(b), div*(float)a);
}

void cOSG::AddOcean()
{
	osg::ref_ptr<osgOcean::FFTOceanSurface> oceanface = new osgOcean::FFTOceanSurface(64, 1024, 17, osg::Vec2f(1.0f, 1.0f), 8.0f, 10000.0f, 1e-8, true, 2.5f, 10.0f, 256); //0.35f, 
	mOceanscene = new osgOcean::OceanScene(oceanface.get());//此类中的构造函数时的变量为oceanTechnique类，FFTOceanSurface是它的子类，所以可以直接用
	mOceanscene->setName("oceanscene");

	//**设置雾效和反射
	mOceanscene->setAboveWaterFog(0.00012, osg::Vec4f(0.67, 0.88, 0.98, 1.0));//osg::Vec4f(0.9,0.9,0.9,1.0)
	mOceanscene->setUnderwaterFog(0.0, osg::Vec4f(0.67, 0.88, 0.98, 1.0));
	mOceanscene->enableReflections(true);
	//oceanscene->enableRefractions(true);
	//oceanface->setEnvironmentMap(cubemap.get());//折射
												//**水花
	oceanface->setFoamBottomHeight(2.2);
	oceanface->setFoamTopHeight(3.0);
	oceanface->enableCrestFoam(true);
	//**设置海洋没有边界
	oceanface->enableEndlessOcean(true);
	//**设置海洋表面的高度和浪高


	osg::ref_ptr<osg::TextureCubeMap> cubemap = loadCubeMapTexture();
	osg::ref_ptr<SkyDome> skydome = new SkyDome(10240.0f, 32, 32, cubemap.get(), mViewer);

	//**设置海洋柱体大小
	osg::ref_ptr<Cylinder> _oceanCylinder = new Cylinder(10240.0f, 400.8f, 32, false, true);
	_oceanCylinder->setColor(intColor(27, 57, 109));
	_oceanCylinder->getOrCreateStateSet()->setMode(GL_LIGHTING, osg::StateAttribute::OFF);
	_oceanCylinder->getOrCreateStateSet()->setMode(GL_FOG, osg::StateAttribute::OFF);

	osg::Geode* oceanCylinderGeode = new osg::Geode;
	oceanCylinderGeode->addDrawable(_oceanCylinder.get());
	oceanCylinderGeode->setNodeMask(mOceanscene->getNormalSceneMask());

	osg::ref_ptr<osg::MatrixTransform> cylinderPat = new osg::MatrixTransform();
	cylinderPat->setMatrix(osg::Matrixf::translate(osg::Vec3f(0.f, 0.f, -1000.f)));
	cylinderPat->addChild(oceanCylinderGeode);

	osg::ref_ptr<osg::MatrixTransform> pat = new osg::MatrixTransform;
	pat->setDataVariance(osg::Object::DYNAMIC);
	pat->setMatrix(osg::Matrixf::translate(osg::Vec3f(0.f, 0.f, 0.f)));
	pat->setUserData(new CameraTrackDataType(*pat));
	pat->setUpdateCallback(new CameraTrackCallback);
	pat->setCullCallback(new CameraTrackCallback);
	pat->addChild(skydome.get());
	pat->addChild(cylinderPat);

	mOceanscene->addChild(pat);
	//mOceanscene->setCylinderSize(19000.0f, 400.0f);

	mRoot->addChild(mOceanscene);
}

/*void cOSG::Render(void* ptr)
{
	cOSG* osg = (cOSG*)ptr;

	osgViewer::Viewer* viewer = osg->getViewer();

	// You have two options for the main viewer loop
	//      viewer->run()   or
	//      while(!viewer->done()) { viewer->frame(); }

	//viewer->run();
	while(!viewer->done())
	{
		osg->PreFrameUpdate();
		viewer->frame();
		osg->PostFrameUpdate();
		//Sleep(10);         // Use this command if you need to allow other processes to have cpu time
	}

	// For some reason this has to be here to avoid issue:
	// if you have multiple OSG windows up
	// and you exit one then all stop rendering
	AfxMessageBox("Exit Rendering Thread");

	_endthread();
}*/

CRenderingThread::CRenderingThread(cOSG* ptr)
	: OpenThreads::Thread(), _ptr(ptr), _done(false)
{
}

CRenderingThread::~CRenderingThread()
{
	_done = true;
	while (isRunning())
		OpenThreads::Thread::YieldCurrentThread();
}

void CRenderingThread::run()
{
	if (!_ptr)
	{
		_done = true;
		return;
	}

	osgViewer::Viewer* viewer = _ptr->getViewer();
	do
	{
		_ptr->PreFrameUpdate();
		viewer->frame();
		_ptr->PostFrameUpdate();
	} while (!testCancel() && !viewer->done() && !_done);
}
