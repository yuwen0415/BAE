#include "ControlHandler.h"

ControlHandler::ControlHandler(osgViewer::Viewer *vw)
{
	m_Viewer = vw;

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
			dynamic_cast<osg::MatrixTransform *>(m_Viewer->getSceneData()->asGroup()->getChild(i))->removeChild(node);
			//dynamic_cast<osg::MatrixTransform *>(m_Viewer->getSceneData()->asGroup()->getChild(i))->setMatrix(osg::Matrixf::translate(osg::Vec3(-3814.0f, -18817.0f, 0.0f)));
			dynamic_cast<osg::MatrixTransform *>(m_Viewer->getSceneData()->asGroup()->getChild(i))->addChild(osgDB::readNodeFile(modelfile));
		}
	}
}


bool ControlHandler::handle(const osgGA::GUIEventAdapter& ea, osgGA::GUIActionAdapter& aa)
{

	//switch (ea.getEventType())
	//{
	//case osgGA::GUIEventAdapter::DOUBLECLICK:
	//{

	//	if (viewer)
	//	{
	//		ButtonMode::m_shipmessage = true;
	//		ButtonMode::m_SAbutton = true;
	//		//PictureBox->show();
	//		//申请一个存放交点的集合
	//		osgUtil::LineSegmentIntersector::Intersections inters;
	//		if (viewer->computeIntersections(ea.getX(), ea.getY(), inters))
	//		{
	//			osgUtil::LineSegmentIntersector::Intersections::iterator iter = inters.begin();
	//			m_position_addship->push_back(iter->getWorldIntersectPoint());


	//			m_shipPosition = osg::Vec3d(iter->getWorldIntersectPoint().x(), iter->getWorldIntersectPoint().y(), 0.0f);
	//			ship_nm->setMatrix(osg::Matrix::translate(m_shipPosition));
	//			ship_nm->addChild(osgDB::readNodeFile("ferry02.ive"));
	//			ship_nm->setUpdateCallback(new ShipMovingCallback);

	//			ship_nm->setName("ship_1");
	//			root->addChild(ship_nm);
	//			ButtonMode::m_shipPosition = m_shipPosition;
	//		}
	//	}

	//	ButtonMode::m_addship = false;
	//}
	//break;
	//case osgGA::GUIEventAdapter::FRAME:
	//{
	//	if (ea.getX() < 100)
	//	{
	//		ButtonBox->show();
	//	}
	//	else
	//	{
	//		ButtonBox->hide();
	//	}
	//	if (ButtonMode::m_control)
	//	{
	//		LRControlButtonBox->show();
	//		UDControlButtonBox->show();
	//	}
	//	else
	//	{
	//		LRControlButtonBox->hide();
	//		UDControlButtonBox->hide();
	//	}
	//	if (ButtonMode::m_SAbutton)
	//	{
	//		SAButtonBox->show();
	//	}
	//	else
	//	{
	//		SAButtonBox->hide();
	//	}
	//	if (ButtonMode::m_shipmessage)
	//	{
	//		PictureBox->show();
	//	}
	//	else
	//	{
	//		PictureBox->hide();
	//	}
	//	if (ButtonMode::m_weatherbutton)
	//	{
	//		WeatherButtonBox->show();
	//	}
	//	else
	//	{
	//		WeatherButtonBox->hide();
	//	}
	//	if (ButtonMode::m_locationbutton)
	//	{
	//		LocationButtonBox->show();
	//	}
	//	else
	//	{
	//		LocationButtonBox->hide();
	//	}
	//}
	//break;

	//}
	return false;
}