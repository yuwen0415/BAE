#include "ControlHandler.h"
#include "TravelManipulator.h"

#include <osgUtil/Optimizer>

ControlHandler::ControlHandler(osgViewer::Viewer *vw)
{
	m_Viewer = vw;
	for (unsigned int i = 0; i < m_Viewer->getSceneData()->asGroup()->getNumChildren(); i++)
	{
		if (m_Viewer->getSceneData()->asGroup()->getChild(i)->getName() == "ship_1")
		{
			ShipTM = new ShipTravelManipulator(dynamic_cast<osg::MatrixTransform *>(m_Viewer->getSceneData()->asGroup()->getChild(i)));
			break;
		}
	}
}

ControlHandler::~ControlHandler(void)
{
}

void ControlHandler::ChangeScenceModel(char modelfile[])
{
	for (unsigned int i = 0; i < m_Viewer->getSceneData()->asGroup()->getNumChildren(); i++)
	{
		if (m_Viewer->getSceneData()->asGroup()->getChild(i)->getName() == "node")
		{
			osg::Node *node = dynamic_cast<osg::MatrixTransform *>(m_Viewer->getSceneData()->asGroup()->getChild(i))->getChild(0);
			dynamic_cast<osg::MatrixTransform *>(m_Viewer->getSceneData()->asGroup()->getChild(i))->replaceChild(node, osgDB::readNodeFile(modelfile));
			return;
		}
	}
}

void ControlHandler::DynamicPositionChangeModel(float screenX, float screenY, char modelfile[])
{
	osgUtil::LineSegmentIntersector::Intersections inters;
	if (m_Viewer->computeIntersections(screenX, screenY, inters))
	{
		osgUtil::LineSegmentIntersector::Intersections::iterator iter = inters.begin();


		osg::Vec3f modelPosition = osg::Vec3f(iter->getWorldIntersectPoint().x(), iter->getWorldIntersectPoint().y(), 0.0f);
		osg::ref_ptr<osg::MatrixTransform> modelMt = new osg::MatrixTransform();

		modelMt->setMatrix(osg::Matrixf::translate(modelPosition));
		//modelMt->setUpdateCallback(new ShipMovingCallback);

		modelMt->addChild(osgDB::readNodeFile(modelfile));
		modelMt->setName("ship_1");
		m_Viewer->getSceneData()->asGroup()->addChild(modelMt);


		//dynamic_cast<TravelManipulator*>(m_Viewer->getCameraManipulator())->setPosition(modelPosition);
	}
}

void ControlHandler::DynamicPositionChangeModel(char modelfile[])
{
	if (m_Viewer != NULL)
	{
		osg::MatrixTransform* modelMt = new osg::MatrixTransform();
		osg::Vec3f viewerPosition = dynamic_cast<TravelManipulator*>(m_Viewer->getCameraManipulator())->getMatrix().getTrans();

		for (unsigned int i = 0; i < m_Viewer->getSceneData()->asGroup()->getNumChildren(); i++)
		{
			if (m_Viewer->getSceneData()->asGroup()->getChild(i)->getName() == "ship_1")
			{
				osg::Node *node = dynamic_cast<osg::MatrixTransform *>(m_Viewer->getSceneData()->asGroup()->getChild(i))->getChild(0);
				dynamic_cast<osg::MatrixTransform *>(m_Viewer->getSceneData()->asGroup()->getChild(i))->setMatrix(osg::Matrixf::translate(osg::Vec3f(viewerPosition.x(), viewerPosition.y(), 0.0f)));
				dynamic_cast<osg::MatrixTransform *>(m_Viewer->getSceneData()->asGroup()->getChild(i))->replaceChild(node, osgDB::readNodeFile(modelfile));
				return;
			}
		}

		//modelMt->setMatrix(osg::Matrixf::translate(osg::Vec3f(viewerPosition.x(), viewerPosition.y(), 0.0f)));
		////modelMt->setUpdateCallback(new ShipMovingCallback);

		//modelMt->addChild(osgDB::readNodeFile(modelfile));
		//modelMt->setName("ship_1");
		//osgUtil::Optimizer optimizer;
		//optimizer.optimize(modelMt);
		//optimizer.reset();

		//m_Viewer->getSceneData()->asGroup()->addChild(modelMt);

		//dynamic_cast<TravelManipulator*>(m_Viewer->getCameraManipulator())->setPosition(modelPosition);
	}
}

void ControlHandler::SetCameraFollowShip()
{
	m_isFollowShip = true;
}

void ControlHandler::SetCameraWander()
{
	m_isFollowShip = false;
}

void ControlHandler::CameraFollowShipMove()
{
	TravelManipulator *cameraTM = dynamic_cast<TravelManipulator *>(m_Viewer->getCameraManipulator());
	osg::Vec3f shipPostion = ShipTM->GetShipPosition();
	float shipRotation = ShipTM->GetShipRotation();
	osg::Vec3d cameraRotation = cameraTM->getRotation();
	cameraTM->setPosition(osg::Vec3d(shipPostion.x() - 8 * cosf(osg::PI_2 + shipRotation), shipPostion.y() - 8 * sinf(osg::PI_2 + shipRotation), 7.0f));
	cameraTM->setRotation(osg::Vec3d(cameraRotation.x(), cameraRotation.y(), shipRotation));
}

bool ControlHandler::handle(const osgGA::GUIEventAdapter& ea, osgGA::GUIActionAdapter& aa)
{
	if (m_isFollowShip)
	{
		switch (ea.getEventType())
		{
		case osgGA::GUIEventAdapter::FRAME:
		{
			if (ShipTM != NULL)
			{
				ShipTM->Move();
				CameraFollowShipMove();
			}
		}
		break;
		}

	}
	return false;
}

void ControlHandler::ShipVecSpeedUp()
{
	ShipTM->VecSpeedUp();
}

void ControlHandler::ShipAngleVecSpeedUp()
{
	ShipTM->AngleVecSpeedUp();
}
void ControlHandler::ReduceShipVec()
{
	ShipTM->ReduceVec();
}
void ControlHandler::ReduceShipAngleVec()
{
	ShipTM->ReduceAngleVec();
}
